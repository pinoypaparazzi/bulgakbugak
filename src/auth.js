/*
 * Account service for Kuya Mark Concierge.
 *
 * DEMO MODE: everything below runs inside the visitor's own browser
 * (localStorage). Nothing is sent to a server and no real email goes out:
 * the 6-digit code and reset link are shown on screen instead.
 * It is for trying out the flow only, NOT for real customers.
 *
 * To go live, replace the bodies of these exported functions with calls to a
 * real backend (e.g. Supabase / Firebase). The pages only use these functions.
 */

export const DEMO_MODE = true;

const KEYS = {
  users: 'km_demo_users',
  pending: 'km_demo_pending',
  resets: 'km_demo_resets',
  session: 'km_session',
};

const CODE_TTL = 10 * 60 * 1000; // 10 minutes
const RESET_TTL = 30 * 60 * 1000; // 30 minutes
export const MIN_PASSWORD = 8;

/* ---------- helpers ---------- */
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked: demo just won't persist */
  }
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function hash(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function sixDigitCode() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return String(n).padStart(6, '0');
}
function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(16).padStart(2, '0')).join('');
}

/* "Outbox" so the demo can show what would have been emailed */
const listeners = new Set();
export function onDemoEmail(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function sendDemoEmail(message) {
  console.info('[Kuya Mark demo email]', message);
  listeners.forEach((fn) => fn(message));
}

/* ---------- validation (shared with the forms) ---------- */
export function normalizePhone(input) {
  let d = String(input || '').replace(/\D/g, '');
  if (d.startsWith('63') && d.length === 12) d = '0' + d.slice(2);
  if (d.startsWith('9') && d.length === 10) d = '0' + d;
  return d;
}
export const isValidPhone = (p) => /^09\d{9}$/.test(normalizePhone(p));
export const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).trim());
export function formatPhone(p) {
  const d = normalizePhone(p);
  return d.length === 11 ? `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7)}` : p;
}
const maskEmail = (e) => e.replace(/^(.)(.*)(@.*)$/, (_, a, mid, dom) => a + '*'.repeat(Math.min(mid.length, 6)) + dom);

/* ---------- API ---------- */

/** Step 1 of sign up: checks details and emails a 6-digit code. */
export async function signUp({ phone, email, password }) {
  await wait(400);
  const p = normalizePhone(phone);
  const e = String(email).trim().toLowerCase();
  if (!isValidPhone(p)) throw new Error('Enter a valid CP number, like 0917-123-4567.');
  if (!isValidEmail(e)) throw new Error('Enter a valid email address.');
  if (String(password).length < MIN_PASSWORD) throw new Error(`Password must be at least ${MIN_PASSWORD} characters.`);

  const users = read(KEYS.users, {});
  if (users[p]) throw new Error('This CP number already has an account. Please log in instead.');
  if (Object.values(users).some((u) => u.email === e)) throw new Error('This email is already used by another account.');

  const code = sixDigitCode();
  const pending = read(KEYS.pending, {});
  pending[p] = { phone: p, email: e, passwordHash: await hash(p + ':' + password), code, expires: Date.now() + CODE_TTL };
  write(KEYS.pending, pending);
  sendDemoEmail({ type: 'code', to: e, code });
  return { email: e, maskedEmail: maskEmail(e) };
}

/** Sends a fresh code for a sign up that is waiting for verification. */
export async function resendCode(phone) {
  await wait(300);
  const p = normalizePhone(phone);
  const pending = read(KEYS.pending, {});
  if (!pending[p]) throw new Error('Your sign up expired. Please start again.');
  pending[p].code = sixDigitCode();
  pending[p].expires = Date.now() + CODE_TTL;
  write(KEYS.pending, pending);
  sendDemoEmail({ type: 'code', to: pending[p].email, code: pending[p].code });
}

/** Step 2 of sign up: checks the code, creates the account and logs in. */
export async function verifyCode(phone, code) {
  await wait(400);
  const p = normalizePhone(phone);
  const pending = read(KEYS.pending, {});
  const entry = pending[p];
  if (!entry) throw new Error('Your sign up expired. Please start again.');
  if (Date.now() > entry.expires) throw new Error('This code has expired. Tap "Resend code" to get a new one.');
  if (String(code) !== entry.code) throw new Error('That code is not correct. Please check your email and try again.');

  const users = read(KEYS.users, {});
  users[p] = { phone: p, email: entry.email, passwordHash: entry.passwordHash, createdAt: Date.now() };
  write(KEYS.users, users);
  delete pending[p];
  write(KEYS.pending, pending);
  return startSession(users[p]);
}

export async function login({ phone, password }) {
  await wait(400);
  const p = normalizePhone(phone);
  const user = read(KEYS.users, {})[p];
  if (!user || user.passwordHash !== (await hash(p + ':' + password))) {
    throw new Error('Incorrect CP number or password.');
  }
  return startSession(user);
}

/** Emails a password reset link. Always "succeeds" so emails can't be probed. */
export async function requestPasswordReset(email) {
  await wait(400);
  const e = String(email).trim().toLowerCase();
  if (!isValidEmail(e)) throw new Error('Enter a valid email address.');
  const user = Object.values(read(KEYS.users, {})).find((u) => u.email === e);
  if (user) {
    const token = randomToken();
    const resets = read(KEYS.resets, {});
    resets[token] = { phone: user.phone, expires: Date.now() + RESET_TTL };
    write(KEYS.resets, resets);
    sendDemoEmail({ type: 'reset', to: e, link: `${window.location.origin}/reset-password?token=${token}` });
  }
}

export async function checkResetToken(token) {
  const entry = read(KEYS.resets, {})[token];
  return Boolean(entry && Date.now() <= entry.expires);
}

export async function resetPassword(token, password) {
  await wait(400);
  if (String(password).length < MIN_PASSWORD) throw new Error(`Password must be at least ${MIN_PASSWORD} characters.`);
  const resets = read(KEYS.resets, {});
  const entry = resets[token];
  if (!entry || Date.now() > entry.expires) throw new Error('This reset link is invalid or has expired. Please request a new one.');
  const users = read(KEYS.users, {});
  const user = users[entry.phone];
  if (!user) throw new Error('Account not found.');
  user.passwordHash = await hash(user.phone + ':' + password);
  write(KEYS.users, users);
  delete resets[token];
  write(KEYS.resets, resets);
}

function startSession(user) {
  const session = { phone: user.phone, email: user.email };
  write(KEYS.session, session);
  return session;
}
export function getSession() {
  return read(KEYS.session, null);
}
export function logout() {
  try {
    localStorage.removeItem(KEYS.session);
  } catch {
    /* ignore */
  }
}
