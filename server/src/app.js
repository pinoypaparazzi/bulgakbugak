import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { isDbConnected } from './db.js';
import inquiries from './routes/inquiries.js';
import auth from './routes/auth.js';

const SESSION_COOKIE = 'ays.sid';
const SESSION_HOURS = 8;

/* sessionStore: where login sessions are kept (MongoDB, see index.js).
   Without one, the /api/auth routes are not mounted. */
export function createApp({ corsOrigin, sessionStore, sessionSecret, cookieDomain, production = false } = {}) {
  const app = express();
  app.disable('x-powered-by');
  // Behind Netlify / a hosting proxy: trust it so secure cookies and client IPs work.
  if (production) app.set('trust proxy', 1);

  app.use(cors({ origin: corsOrigin ? corsOrigin.split(',').map((s) => s.trim()) : false, credentials: true }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, db: isDbConnected() ? 'connected' : 'disconnected' });
  });
  app.use('/api/inquiries', inquiries);

  if (sessionStore) {
    if (!sessionSecret || sessionSecret.length < 32) {
      throw new Error('SESSION_SECRET must be set in server/.env and be at least 32 characters long.');
    }
    const cookie = {
      httpOnly: true, // not readable by page scripts
      sameSite: 'lax', // not sent on cross-site form posts (CSRF protection)
      secure: production, // HTTPS only in production
      domain: cookieDomain || undefined,
      maxAge: SESSION_HOURS * 60 * 60 * 1000,
    };
    app.set('sessionCookieName', SESSION_COOKIE);
    app.set('sessionCookieOptions', { ...cookie, maxAge: undefined });
    const sessions = session({
      name: SESSION_COOKIE,
      secret: sessionSecret,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      rolling: true, // stays signed in while active; signs out after 8 idle hours
      cookie,
    });
    app.use('/api/auth', sessions, auth);
  }

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: 'Something went wrong' });
  });
  return app;
}
