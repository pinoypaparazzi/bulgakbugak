import session from 'express-session';

/* =========================================================
   STAFF SESSIONS
   - The browser only holds a random session ID in an httpOnly cookie
     (unreadable by page scripts). Who is signed in is stored on the
     server, in the MongoDB `sessions` collection.
   - SameSite=Strict: the cookie is never sent on requests started by
     another website (first line of CSRF defence; see csrfGuard).
   - Secure (HTTPS only) when NODE_ENV=production.
   - Path=/api/staff: the cookie is only sent to staff API routes.
   - Idle timeout: 2 hours without activity (rolling).
   - Absolute timeout: 12 hours after sign-in, active or not
     (checked in middleware.js).
   ========================================================= */
export const SESSION_COOKIE_NAME = 'ays_staff_sid';
export const SESSION_IDLE_MS = 2 * 60 * 60 * 1000;
export const SESSION_ABSOLUTE_MS = 12 * 60 * 60 * 1000;

export function cookieOptions(production) {
  return { httpOnly: true, sameSite: 'strict', secure: production, path: '/api/staff' };
}

export function createSessionMiddleware({ store, secret, production }) {
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set (in server/.env) to a random value of at least 32 characters.');
  }
  return session({
    name: SESSION_COOKIE_NAME,
    secret,
    store,
    resave: false,
    saveUninitialized: false, // no session (or cookie) until someone signs in
    rolling: true,
    unset: 'destroy',
    proxy: production ? true : undefined,
    cookie: { ...cookieOptions(production), maxAge: SESSION_IDLE_MS },
  });
}

/* express-session uses callbacks; these make them awaitable. */
export const regenerateSession = (req) => new Promise((resolve, reject) => req.session.regenerate((err) => (err ? reject(err) : resolve())));
export const saveSession = (req) => new Promise((resolve, reject) => req.session.save((err) => (err ? reject(err) : resolve())));
export const destroySession = (req) =>
  new Promise((resolve, reject) => (req.session ? req.session.destroy((err) => (err ? reject(err) : resolve())) : resolve()));

/* Starts a fresh session for `user` (new ID, so an old ID can't be reused: prevents session fixation). */
export async function startSession(req, user, sessionVersion) {
  await regenerateSession(req);
  req.session.staffUserId = String(user._id);
  req.session.sessionVersion = sessionVersion;
  req.session.authenticatedAt = Date.now();
  await saveSession(req);
}
