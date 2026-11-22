import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import StaffUser from '../src/models/StaffUser.js';
import AuditEvent from '../src/models/AuditEvent.js';
import { PERMISSIONS as P } from '../src/auth/roles.js';
import { requirePermission } from '../src/auth/middleware.js';
import { createStaff, signedIn, startTestServer, strongPassword, uniqueName } from './helpers.js';

let server;
before(async () => {
  server = await startTestServer();
});
after(async () => {
  await server?.stop();
});

const newAccount = (role, extra = {}) => ({ username: uniqueName('new'), displayName: 'New Person', role, ...extra });

describe('creating staff accounts', () => {
  test('Super Duper Admin can create every role, including Super Duper Admin', async () => {
    const { client } = await signedIn(server, 'super_duper_admin');
    for (const role of ['super_duper_admin', 'super_admin', 'admin', 'investor', 'hr']) {
      const res = await client.post('/api/staff/accounts', newAccount(role));
      assert.equal(res.status, 201, role);
      assert.equal(res.data.user.role, role);
      assert.equal(res.data.user.mustChangePassword, true);
      assert.match(res.data.temporaryPassword, /^[A-Za-z2-9]{4}(-[A-Za-z2-9]{4}){3}$/);
    }
  });

  test('the temporary password works once and forces a password change', async () => {
    const { client } = await signedIn(server, 'super_admin');
    const created = await client.post('/api/staff/accounts', newAccount('hr'));
    const person = server.client();
    const login = await person.login(created.data.user.username, created.data.temporaryPassword);
    assert.equal(login.status, 200);
    assert.equal(login.data.user.mustChangePassword, true);
    const blocked = await person.get('/api/staff/accounts');
    assert.equal(blocked.data.code, 'password_change_required');
  });

  test('Super Admin can create Super Admin, Admin, Investor and HR accounts', async () => {
    const { client } = await signedIn(server, 'super_admin');
    for (const role of ['super_admin', 'admin', 'investor', 'hr']) {
      assert.equal((await client.post('/api/staff/accounts', newAccount(role))).status, 201, role);
    }
  });

  test('Super Admin cannot create a Super Duper Admin', async () => {
    const { client } = await signedIn(server, 'super_admin');
    const body = newAccount('super_duper_admin');
    const res = await client.post('/api/staff/accounts', body);
    assert.equal(res.status, 403);
    assert.equal(res.data.code, 'role_not_assignable');
    assert.equal(await StaffUser.countDocuments({ username: body.username }), 0, 'no account was created');
  });

  test('Admin, Investor and HR cannot create or list accounts', async () => {
    for (const role of ['admin', 'investor', 'hr']) {
      const { client } = await signedIn(server, role);
      const create = await client.post('/api/staff/accounts', newAccount('admin'));
      assert.equal(create.status, 403, `${role} create`);
      assert.equal((await client.get('/api/staff/accounts')).status, 403, `${role} list`);
      assert.equal((await client.get('/api/staff/audit')).status, 403, `${role} audit`);
    }
  });

  test('only username, displayName and role are accepted (no mass assignment)', async () => {
    const { client } = await signedIn(server, 'super_duper_admin');
    for (const extra of [{ mustChangePassword: false }, { status: 'active' }, { passwordHash: 'x' }, { password: 'chosen-by-client-123' }, { permissions: ['audit.read'] }]) {
      const res = await client.post('/api/staff/accounts', newAccount('admin', extra));
      assert.equal(res.status, 400, JSON.stringify(extra));
    }
  });

  test('input is validated on the server', async () => {
    const { client } = await signedIn(server, 'super_duper_admin');
    for (const body of [
      newAccount('admin', { username: 'ab' }),
      newAccount('admin', { username: 'has space' }),
      newAccount('admin', { username: { $gt: '' } }),
      newAccount('admin', { displayName: '' }),
      newAccount('admin', { displayName: '<script>' }),
      newAccount('owner'),
    ]) {
      assert.equal((await client.post('/api/staff/accounts', body)).status, 400, JSON.stringify(body));
    }
  });

  test('duplicate usernames are refused, including simultaneous requests', async () => {
    const { client } = await signedIn(server, 'super_duper_admin');
    const username = uniqueName('dup');
    assert.equal((await client.post('/api/staff/accounts', newAccount('admin', { username }))).status, 201);
    const again = await client.post('/api/staff/accounts', newAccount('admin', { username: username.toUpperCase() }));
    assert.equal(again.status, 409);
    assert.equal(again.data.code, 'username_taken');

    const racer = uniqueName('race');
    const results = await Promise.all(Array.from({ length: 6 }, () => client.post('/api/staff/accounts', newAccount('admin', { username: racer }))));
    assert.equal(results.filter((r) => r.status === 201).length, 1);
    assert.ok(results.every((r) => r.status === 201 || r.status === 409));
    assert.equal(await StaffUser.countDocuments({ username: racer }), 1);
  });
});

describe('changing staff accounts', () => {
  test('Super Admin cannot change, deactivate or reset a Super Duper Admin', async () => {
    const sda = await createStaff({ role: 'super_duper_admin' });
    const { client } = await signedIn(server, 'super_admin');
    const id = sda.user.id;
    for (const body of [{ status: 'deactivated' }, { role: 'admin' }, { displayName: 'Renamed' }]) {
      const res = await client.patch(`/api/staff/accounts/${id}`, body);
      assert.equal(res.status, 403, JSON.stringify(body));
      assert.equal(res.data.code, 'protected_account');
    }
    assert.equal((await client.post(`/api/staff/accounts/${id}/reset-password`)).status, 403);
    const fresh = await StaffUser.findById(id);
    assert.equal(fresh.role, 'super_duper_admin');
    assert.equal(fresh.status, 'active');
  });

  test('Super Admin cannot promote anyone to Super Duper Admin', async () => {
    const target = await createStaff({ role: 'admin' });
    const { client } = await signedIn(server, 'super_admin');
    const res = await client.patch(`/api/staff/accounts/${target.user.id}`, { role: 'super_duper_admin' });
    assert.equal(res.status, 403);
    assert.equal((await StaffUser.findById(target.user.id)).role, 'admin');
  });

  test('nobody can change their own role or status', async () => {
    for (const role of ['super_admin', 'super_duper_admin']) {
      const me = await signedIn(server, role);
      for (const body of [{ role: 'super_duper_admin' }, { status: 'deactivated' }]) {
        const res = await me.client.patch(`/api/staff/accounts/${me.user.id}`, body);
        assert.equal(res.status, 403, `${role} ${JSON.stringify(body)}`);
        assert.equal(res.data.code, 'self_change_forbidden');
      }
    }
  });

  test('Admin cannot change any account, even by calling the API directly', async () => {
    const victim = await createStaff({ role: 'hr' });
    const { client, user } = await signedIn(server, 'admin');
    assert.equal((await client.patch(`/api/staff/accounts/${victim.user.id}`, { role: 'admin' })).status, 403);
    assert.equal((await client.patch(`/api/staff/accounts/${user.id}`, { role: 'super_duper_admin' })).status, 403);
    assert.equal((await client.post(`/api/staff/accounts/${victim.user.id}/reset-password`)).status, 403);
    assert.equal((await StaffUser.findById(user.id)).role, 'admin');
  });

  test('a role change takes effect immediately and ends the old sessions', async () => {
    const target = await signedIn(server, 'admin');
    const boss = await signedIn(server, 'super_duper_admin');
    const res = await boss.client.patch(`/api/staff/accounts/${target.user.id}`, { role: 'investor' });
    assert.equal(res.status, 200);
    assert.equal(res.data.account.role, 'investor');
    assert.equal((await target.client.get('/api/staff/auth/me')).status, 401);
    const again = server.client();
    const login = await again.login(target.username, target.password);
    assert.equal(login.data.user.role, 'investor');
    assert.ok(login.data.permissions.includes('accounting.records.read'));
    assert.ok(!login.data.permissions.includes('bookings.update'));
  });

  test('reactivating a deactivated account lets the person sign in again', async () => {
    const target = await createStaff({ role: 'hr' });
    const { client } = await signedIn(server, 'super_admin');
    await client.patch(`/api/staff/accounts/${target.user.id}`, { status: 'deactivated' });
    assert.equal((await server.client().login(target.username, target.password)).status, 403);
    await client.patch(`/api/staff/accounts/${target.user.id}`, { status: 'active' });
    assert.equal((await server.client().login(target.username, target.password)).status, 200);
  });

  test('password reset issues a new temporary password and ends old sessions', async () => {
    const target = await signedIn(server, 'investor');
    const { client } = await signedIn(server, 'super_admin');
    const res = await client.post(`/api/staff/accounts/${target.user.id}/reset-password`);
    assert.equal(res.status, 200);
    assert.ok(res.data.temporaryPassword);
    assert.equal((await target.client.get('/api/staff/auth/me')).status, 401);
    assert.equal((await server.client().login(target.username, target.password)).status, 401);
    const login = await server.client().login(target.username, res.data.temporaryPassword);
    assert.equal(login.data.user.mustChangePassword, true);
  });

  test('changing a record ID cannot reach other records', async () => {
    const { client } = await signedIn(server, 'super_admin');
    for (const id of ['000000000000000000000000', 'not-an-id', '../../audit', '{"$ne":null}']) {
      const res = await client.get(`/api/staff/accounts/${encodeURIComponent(id)}`);
      assert.equal(res.status, 404, id);
    }
    const bad = await client.patch('/api/staff/accounts/000000000000000000000000', { status: 'deactivated' });
    assert.equal(bad.status, 404);
  });

  test('account responses never include password hashes', async () => {
    const { client } = await signedIn(server, 'super_duper_admin');
    const list = await client.get('/api/staff/accounts');
    assert.equal(list.status, 200);
    const text = JSON.stringify(list.data);
    assert.ok(!text.includes('passwordHash') && !text.includes('$argon2') && !text.includes('sessionVersion'));
  });

  test('changes are recorded in the audit log, readable by Super Duper Admin', async () => {
    const target = await createStaff({ role: 'admin' });
    const boss = await signedIn(server, 'super_duper_admin');
    await boss.client.patch(`/api/staff/accounts/${target.user.id}`, { displayName: 'Audited Name' });
    const event = await AuditEvent.findOne({ action: 'staff.account.updated', 'target.id': target.user._id }).lean();
    assert.deepEqual(event.details.displayName.to, 'Audited Name');
    const audit = await boss.client.get('/api/staff/audit?limit=5');
    assert.equal(audit.status, 200);
    assert.ok(audit.data.events.length > 0);
  });
});

describe('permission middleware for future modules', () => {
  // The CRM, bookings, HR and accounting modules don't exist yet. This builds
  // a probe app with the real middleware to prove how their routes will be
  // protected: each role reaches only what its permissions allow.
  const probe = express();
  probe.use((req, res, next) => {
    req.staff = { role: req.get('x-role'), username: 'probe' };
    next();
  });
  const routes = {
    'crm.update': P.CRM_CUSTOMERS_UPDATE,
    'bookings.update': P.BOOKINGS_UPDATE,
    'hr.create': P.HR_EMPLOYEES_CREATE,
    'hr.skills': P.HR_SKILLS_MANAGE,
    'accounting.read': P.ACCOUNTING_RECORDS_READ,
    'accounting.transactions': P.ACCOUNTING_TRANSACTIONS_READ,
    'accounting.create': P.ACCOUNTING_RECORDS_CREATE,
    'accounting.update': P.ACCOUNTING_RECORDS_UPDATE,
    'accounting.delete': P.ACCOUNTING_RECORDS_DELETE,
    'settings': P.SYSTEM_SETTINGS_MANAGE,
  };
  for (const [name, perm] of Object.entries(routes)) probe.post(`/${name}`, requirePermission(perm), (req, res) => res.sendStatus(200));
  probe.use((err, req, res, next) => res.sendStatus(err.status || 500)); // eslint-disable-line no-unused-vars

  const expected = {
    admin: ['crm.update', 'bookings.update'],
    investor: ['accounting.read', 'accounting.transactions'],
    hr: ['hr.create', 'hr.skills'],
    super_admin: Object.keys(routes),
    super_duper_admin: Object.keys(routes),
  };

  test('each role reaches exactly the routes its permissions allow', async () => {
    const srv = await new Promise((resolve) => {
      const s = probe.listen(0, '127.0.0.1', () => resolve(s));
    });
    const base = `http://127.0.0.1:${srv.address().port}`;
    try {
      for (const [role, allowed] of Object.entries(expected)) {
        for (const name of Object.keys(routes)) {
          const res = await fetch(`${base}/${name}`, { method: 'POST', headers: { 'x-role': role } });
          assert.equal(res.status, allowed.includes(name) ? 200 : 403, `${role} → ${name}`);
        }
      }
      const anon = await fetch(`${base}/crm.update`, { method: 'POST' });
      assert.equal(anon.status, 403);
    } finally {
      srv.close();
    }
  });
});

test('strong password helper sanity', () => {
  assert.ok(strongPassword().length >= 12);
});
