import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import StaffUser from '../src/models/StaffUser.js';
import AuditEvent from '../src/models/AuditEvent.js';
import { createStaff, signedIn, startTestServer, strongPassword } from './helpers.js';

let server;
before(async () => {
  server = await startTestServer();
});
after(async () => {
  await server?.stop();
});

describe('sign-in', () => {
  test('valid credentials sign in and set a secure session cookie', async () => {
    const { username, password } = await createStaff({ role: 'admin' });
    const c = server.client();
    const res = await c.login(username.toUpperCase(), password); // usernames are case-insensitive
    assert.equal(res.status, 200);
    assert.equal(res.data.user.username, username);
    assert.equal(res.data.user.role, 'admin');
    assert.ok(Array.isArray(res.data.permissions));
    const cookie = res.setCookies.find((s) => s.startsWith('ays_staff_sid='));
    assert.ok(cookie, 'session cookie set');
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=Strict/i);
    assert.match(cookie, /Path=\/api\/staff/i);
    assert.equal(res.headers.get('cache-control'), 'no-store');

    const me = await c.get('/api/staff/auth/me');
    assert.equal(me.status, 200);
    assert.equal(me.data.user.username, username);
  });

  test('wrong password and unknown username give the same generic answer', async () => {
    const { username } = await createStaff({ role: 'admin' });
    const wrong = await server.client().login(username, 'not-the-password-123');
    const unknown = await server.client().login('nobody-here', 'not-the-password-123');
    assert.equal(wrong.status, 401);
    assert.equal(unknown.status, 401);
    assert.deepEqual(wrong.data, unknown.data);
    assert.equal(wrong.data.error, 'Incorrect username or password.');
    assert.ok(!wrong.setCookies.some((s) => s.startsWith('ays_staff_sid=')), 'no session on failure');
  });

  test('missing fields and unexpected fields are rejected', async () => {
    const c = server.client();
    assert.equal((await c.post('/api/staff/auth/login', { username: 'x' })).status, 400);
    assert.equal((await c.post('/api/staff/auth/login', { username: 'x', password: 'y', role: 'super_duper_admin' })).status, 400);
    assert.equal((await c.post('/api/staff/auth/login', ['x'])).status, 400);
  });

  test('passwords are stored only as Argon2id hashes and never returned', async () => {
    const { user, password } = await createStaff({ role: 'hr' });
    const raw = await mongoose.connection.db.collection('staff_users').findOne({ _id: user._id });
    assert.match(raw.passwordHash, /^\$argon2id\$/);
    assert.ok(!JSON.stringify(raw).includes(password));
    const c = server.client();
    const res = await c.login(user.username, password);
    const body = JSON.stringify(res.data) + JSON.stringify((await c.get('/api/staff/auth/me')).data);
    assert.ok(!body.includes('passwordHash') && !body.includes('$argon2') && !body.includes('sessionVersion'));
  });

  test('deactivated accounts cannot sign in', async () => {
    const { username, password } = await createStaff({ role: 'admin', status: 'deactivated' });
    const res = await server.client().login(username, password);
    assert.equal(res.status, 403);
    assert.equal(res.data.code, 'account_deactivated');
  });

  test('repeated failed sign-ins are rate limited', async () => {
    const { username, password } = await createStaff({ role: 'admin' });
    const c = server.client();
    for (let i = 0; i < 10; i++) assert.equal((await c.login(username, `wrong-password-${i}`)).status, 401);
    const blocked = await c.login(username, `wrong-password-x`);
    assert.equal(blocked.status, 429);
    assert.equal(blocked.data.code, 'rate_limited');
    // Even the right password is refused while blocked.
    assert.equal((await c.login(username, password)).status, 429);
    // A different network address is not affected.
    assert.equal((await server.client().login(username, password)).status, 200);
  });

  test('failed and successful sign-ins are audited without secrets', async () => {
    const { user, password } = await createStaff({ role: 'admin' });
    await server.client().login(user.username, 'wrong-password-123');
    await server.client().login(user.username, password);
    const events = await AuditEvent.find({ 'target.id': user._id, action: 'staff.login' }).lean();
    assert.deepEqual(events.map((e) => e.outcome).sort(), ['failure', 'success']);
    assert.ok(!JSON.stringify(events).includes(password));
  });
});

describe('sessions', () => {
  test('protected routes reject requests without a session', async () => {
    const c = server.client();
    assert.equal((await c.get('/api/staff/auth/me')).status, 401);
    assert.equal((await c.get('/api/staff/accounts')).status, 401);
    assert.equal((await c.get('/api/staff/audit')).status, 401);
  });

  test('a forged or tampered cookie is rejected', async () => {
    const c = server.client();
    c.cookie = 'ays_staff_sid=s%3Aforged.session';
    assert.equal((await c.get('/api/staff/auth/me')).status, 401);
  });

  test('logout ends the session, and the old cookie no longer works', async () => {
    const { client } = await signedIn(server, 'admin');
    const oldCookie = client.cookie;
    const out = await client.post('/api/staff/auth/logout');
    assert.equal(out.status, 204);
    assert.equal(client.cookie, null);
    const replay = server.client();
    replay.cookie = oldCookie;
    assert.equal((await replay.get('/api/staff/auth/me')).status, 401);
  });

  test('deactivating an account ends its existing sessions', async () => {
    const target = await signedIn(server, 'admin');
    const boss = await signedIn(server, 'super_duper_admin');
    assert.equal((await target.client.get('/api/staff/auth/me')).status, 200);
    const res = await boss.client.patch(`/api/staff/accounts/${target.user.id}`, { status: 'deactivated' });
    assert.equal(res.status, 200);
    const after = await target.client.get('/api/staff/auth/me');
    assert.equal(after.status, 401);
    assert.equal(after.data.code, 'session_expired');
  });

  test('sessions older than the absolute limit are refused', async () => {
    const { client, user } = await signedIn(server, 'admin');
    const sid = decodeURIComponent(client.cookie.split('=')[1]).slice(2).split('.')[0];
    const sessions = mongoose.connection.db.collection('sessions');
    const doc = await sessions.findOne({ _id: sid });
    const data = typeof doc.session === 'string' ? JSON.parse(doc.session) : doc.session;
    data.authenticatedAt = Date.now() - 13 * 60 * 60 * 1000;
    await sessions.updateOne({ _id: sid }, { $set: { session: typeof doc.session === 'string' ? JSON.stringify(data) : data } });
    const res = await client.get('/api/staff/auth/me');
    assert.equal(res.status, 401, `user ${user.username} should be signed out`);
    assert.equal(res.data.code, 'session_expired');
  });
});

describe('CSRF protection', () => {
  test('state-changing requests without the CSRF header are refused', async () => {
    const { username, password } = await createStaff({ role: 'admin' });
    const res = await server.client().post('/api/staff/auth/login', { username, password }, { csrf: false });
    assert.equal(res.status, 403);
    assert.equal(res.data.code, 'csrf_failed');
  });

  test('requests from another website are refused', async () => {
    const { client } = await signedIn(server, 'super_duper_admin');
    const res = await client.post('/api/staff/accounts', { username: 'evil1', displayName: 'Evil', role: 'admin' }, { headers: { origin: 'https://attacker.example' } });
    assert.equal(res.status, 403);
    assert.equal(res.data.code, 'csrf_failed');
  });

  test('no credentialed CORS is offered to other origins', async () => {
    const res = await fetch(`${server.base}/api/staff/auth/me`, { method: 'OPTIONS', headers: { origin: 'https://attacker.example', 'access-control-request-method': 'GET' } });
    assert.notEqual(res.headers.get('access-control-allow-credentials'), 'true');
    assert.equal(res.headers.get('access-control-allow-origin'), null);
  });
});

describe('first sign-in password change', () => {
  test('a required password change blocks protected modules until done', async () => {
    const { client, username, password } = await signedIn(server, 'super_duper_admin', { mustChangePassword: true });
    const me = await client.get('/api/staff/auth/me');
    assert.equal(me.status, 200);
    assert.equal(me.data.user.mustChangePassword, true);
    for (const path of ['/api/staff/accounts', '/api/staff/audit']) {
      const res = await client.get(path);
      assert.equal(res.status, 403, path);
      assert.equal(res.data.code, 'password_change_required');
    }
    const blockedCreate = await client.post('/api/staff/accounts', { username: 'sneaky1', displayName: 'Sneaky', role: 'admin' });
    assert.equal(blockedCreate.data.code, 'password_change_required');

    const newPassword = strongPassword();
    const changed = await client.post('/api/staff/auth/change-password', { currentPassword: password, newPassword });
    assert.equal(changed.status, 200);
    assert.equal(changed.data.user.mustChangePassword, false);
    assert.equal((await client.get('/api/staff/accounts')).status, 200);

    // Old password no longer works; new one does.
    assert.equal((await server.client().login(username, password)).status, 401);
    assert.equal((await server.client().login(username, newPassword)).status, 200);
  });

  test('changing the password signs out other sessions but keeps this one', async () => {
    const { username, password } = await createStaff({ role: 'admin' });
    const a = server.client();
    const b = server.client();
    await a.login(username, password);
    await b.login(username, password);
    const oldCookieA = a.cookie;
    const res = await a.post('/api/staff/auth/change-password', { currentPassword: password, newPassword: strongPassword() });
    assert.equal(res.status, 200);
    assert.notEqual(a.cookie, oldCookieA, 'session ID rotated');
    assert.equal((await a.get('/api/staff/auth/me')).status, 200);
    assert.equal((await b.get('/api/staff/auth/me')).status, 401);
  });

  test('wrong current password, weak and reused passwords are rejected', async () => {
    const { client, password, username } = await signedIn(server, 'hr', { mustChangePassword: true });
    const wrong = await client.post('/api/staff/auth/change-password', { currentPassword: 'nope-nope-nope', newPassword: strongPassword() });
    assert.equal(wrong.data.code, 'wrong_current_password');
    const weak = await client.post('/api/staff/auth/change-password', { currentPassword: password, newPassword: 'short' });
    assert.equal(weak.data.code, 'weak_password');
    const withName = await client.post('/api/staff/auth/change-password', { currentPassword: password, newPassword: `${username}-is-me-2026` });
    assert.equal(withName.data.code, 'weak_password');
    const same = await client.post('/api/staff/auth/change-password', { currentPassword: password, newPassword: password });
    assert.equal(same.data.code, 'weak_password');
    const user = await StaffUser.findOne({ username });
    assert.equal(user.mustChangePassword, true, 'still required after failed attempts');
  });
});

describe('error handling', () => {
  test('malformed JSON is rejected without logging the body', async () => {
    const original = console.error;
    const logged = [];
    console.error = (...args) => logged.push(args.join(' '));
    try {
      const res = await server.client().request('POST', '/api/staff/auth/login', '{"username":"a","password":"SECRET-MARKER-123"', { raw: true });
      assert.equal(res.status, 400);
      assert.equal(res.data.code, 'invalid_json');
    } finally {
      console.error = original;
    }
    assert.ok(!logged.join('\n').includes('SECRET-MARKER-123'));
  });

  test('existing public API routes still work', async () => {
    const health = await fetch(`${server.base}/api/health`);
    assert.equal(health.status, 200);
    const inquiry = await fetch(`${server.base}/api/inquiries`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    assert.equal(inquiry.status, 400);
    assert.ok((await inquiry.json()).errors.name);
  });

  test('there is no web endpoint for bootstrap or registration', async () => {
    const c = server.client();
    for (const path of ['/api/staff/bootstrap', '/api/staff/auth/register', '/api/staff/auth/signup', '/api/staff/setup']) {
      assert.equal((await c.post(path, { username: 'x', password: 'y' })).status, 404, path);
    }
  });
});
