import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import StaffUser from '../src/models/StaffUser.js';
import SystemState, { BOOTSTRAP_MARKER } from '../src/models/SystemState.js';
import AuditEvent from '../src/models/AuditEvent.js';
import { BootstrapError, bootstrapSuperDuperAdmin } from '../src/services/bootstrap.js';
import { startTestServer, strongPassword } from './helpers.js';

let server;
before(async () => {
  server = await startTestServer();
});
after(async () => {
  await server?.stop();
});

const reset = async () => {
  await StaffUser.deleteMany({});
  await SystemState.deleteMany({});
};

test('rejects bad input before touching the database', async () => {
  await reset();
  await assert.rejects(bootstrapSuperDuperAdmin({ username: 'bologacbogac', displayName: 'Owner', password: 'short' }), BootstrapError);
  await assert.rejects(bootstrapSuperDuperAdmin({ username: 'x', displayName: 'Owner', password: strongPassword() }), BootstrapError);
  assert.equal(await StaffUser.countDocuments(), 0);
  assert.equal(await SystemState.countDocuments(), 0);
});

test('creates the Super Duper Admin, requires a password change, and stores only a hash', async () => {
  await reset();
  const password = strongPassword();
  const user = await bootstrapSuperDuperAdmin({ username: 'BologacBogac', displayName: 'Super Duper Admin', password });
  assert.equal(user.username, 'bologacbogac');
  assert.equal(user.role, 'super_duper_admin');
  assert.equal(user.mustChangePassword, true);
  const raw = await mongoose.connection.db.collection('staff_users').findOne({ username: 'bologacbogac' });
  assert.match(raw.passwordHash, /^\$argon2id\$/);
  assert.ok(!JSON.stringify(raw).includes(password));
  assert.ok(await SystemState.exists({ _id: BOOTSTRAP_MARKER }));
  assert.ok(await AuditEvent.exists({ action: 'staff.bootstrap' }));

  // The new account signs in, and must change its password first.
  const c = server.client();
  const login = await c.login('bologacbogac', password);
  assert.equal(login.status, 200);
  assert.equal(login.data.user.mustChangePassword, true);
  assert.equal((await c.get('/api/staff/accounts')).data.code, 'password_change_required');
});

test('is disabled after it succeeds (second run refused)', async () => {
  // State from the previous test: bootstrap already done.
  await assert.rejects(
    bootstrapSuperDuperAdmin({ username: 'another-owner', displayName: 'Other', password: strongPassword() }),
    /already been completed/,
  );
  assert.equal(await StaffUser.countDocuments({ role: 'super_duper_admin' }), 1);
});

test('refuses if a Super Duper Admin already exists, even without the marker', async () => {
  await SystemState.deleteMany({});
  await assert.rejects(
    bootstrapSuperDuperAdmin({ username: 'another-owner', displayName: 'Other', password: strongPassword() }),
    /already exists/,
  );
  assert.equal(await StaffUser.countDocuments({ role: 'super_duper_admin' }), 1);
});

test('simultaneous runs create exactly one account', async () => {
  await reset();
  const results = await Promise.allSettled(
    Array.from({ length: 6 }, (_, i) =>
      bootstrapSuperDuperAdmin({ username: i % 2 ? 'bologacbogac' : `owner${i}x`, displayName: 'Owner', password: strongPassword() }),
    ),
  );
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
  for (const r of results.filter((x) => x.status === 'rejected')) assert.ok(r.reason instanceof BootstrapError, String(r.reason));
  assert.equal(await StaffUser.countDocuments({ role: 'super_duper_admin' }), 1);
  assert.equal(await SystemState.countDocuments({ _id: BOOTSTRAP_MARKER }), 1);
});

test('public users cannot bootstrap or recreate the account over HTTP', async () => {
  const c = server.client();
  for (const path of ['/api/staff/bootstrap', '/api/staff/auth/bootstrap', '/api/staff/accounts']) {
    const res = await c.post(path, { username: 'bologacbogac', displayName: 'X', role: 'super_duper_admin' });
    assert.ok([401, 404].includes(res.status), `${path} → ${res.status}`);
  }
  assert.equal(await StaffUser.countDocuments({ role: 'super_duper_admin' }), 1);
});
