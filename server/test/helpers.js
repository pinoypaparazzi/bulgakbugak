import { randomBytes, randomInt } from 'node:crypto';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { createApp } from '../src/app.js';
import { ensureIndexes } from '../src/models/index.js';
import StaffUser from '../src/models/StaffUser.js';
import { hashPassword } from '../src/auth/password.js';

/* Starts the real Express app against a throwaway in-memory MongoDB
   replica set (transactions supported). Nothing touches the real database. */
export async function startTestServer(options = {}) {
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
  await mongoose.connect(replSet.getUri(), { dbName: 'ays_test' });
  await ensureIndexes();
  const sessionStore = MongoStore.create({
    client: mongoose.connection.getClient(),
    dbName: 'ays_test',
    collectionName: 'sessions',
  });
  // trust proxy lets each test client use its own X-Forwarded-For address,
  // so rate limits are tested per client instead of being shared by all tests.
  const app = createApp({ sessionStore, sessionSecret: randomBytes(32).toString('hex'), trustProxy: true, ...options });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    base,
    client: (opts) => new Client(base, opts),
    async stop() {
      await new Promise((r) => server.close(r));
      await sessionStore.close().catch(() => {});
      await mongoose.disconnect();
      await replSet.stop();
    },
  };
}

export const randomIp = () => `10.${randomInt(256)}.${randomInt(256)}.${randomInt(1, 255)}`;
export const strongPassword = () => `Test-${randomBytes(12).toString('base64url')}`;
export const uniqueName = (prefix = 'user') => `${prefix}${randomBytes(4).toString('hex')}`;

/* A minimal browser stand-in: keeps the session cookie and sends the CSRF header. */
export class Client {
  constructor(base, { ip = randomIp() } = {}) {
    this.base = base;
    this.ip = ip;
    this.cookie = null;
  }

  async request(method, path, body, { csrf = true, headers = {}, raw = false } = {}) {
    const h = { 'x-forwarded-for': this.ip, ...headers };
    if (csrf) h['x-ays-csrf'] = '1';
    if (body !== undefined) h['content-type'] = 'application/json';
    if (this.cookie) h.cookie = this.cookie;
    const res = await fetch(this.base + path, {
      method,
      headers: h,
      body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
    });
    const setCookies = res.headers.getSetCookie();
    for (const c of setCookies) {
      if (c.startsWith('ays_staff_sid=')) {
        const pair = c.split(';')[0];
        this.cookie = pair === 'ays_staff_sid=' ? null : pair;
      }
    }
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { status: res.status, data, headers: res.headers, setCookies };
  }

  get(path, opts) { return this.request('GET', path, undefined, opts); }
  post(path, body = {}, opts) { return this.request('POST', path, body, opts); }
  patch(path, body = {}, opts) { return this.request('PATCH', path, body, opts); }

  login(username, password) {
    return this.post('/api/staff/auth/login', { username, password });
  }
}

/* Creates an account directly in the database (test setup only). */
export async function createStaff({ role, username = uniqueName(role.replace(/_/g, '')), password = strongPassword(), mustChangePassword = false, status = 'active' }) {
  const user = await StaffUser.create({
    username,
    displayName: `Test ${role}`,
    role,
    status,
    passwordHash: await hashPassword(password),
    mustChangePassword,
  });
  return { user, username, password };
}

/* Creates an account and returns a signed-in client for it. */
export async function signedIn(server, role, extra = {}) {
  const account = await createStaff({ role, ...extra });
  const client = server.client();
  const res = await client.login(account.username, account.password);
  if (res.status !== 200) throw new Error(`login failed for ${role}: ${res.status} ${JSON.stringify(res.data)}`);
  return { ...account, client };
}
