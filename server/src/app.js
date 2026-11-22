import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { isDbConnected } from './db.js';
import inquiries from './routes/inquiries.js';
import { createStaffRouter } from './routes/staff/index.js';

/* Builds the Express app.
   - corsOrigin: comma-separated origins allowed to call the public routes.
   - sessionStore + sessionSecret: enable the staff API (/api/staff). Without
     a store the staff routes are not mounted.
   - production: HTTPS-only cookies.
   - trustProxy: Express "trust proxy" setting when behind a hosting proxy.
   - staffAppOrigins: origins allowed to call the staff API cross-origin
     (only needed if the staff app is not served through the same origin). */
export function createApp({ corsOrigin, sessionStore, sessionSecret, production = false, trustProxy, staffAppOrigins = [] } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('production', production);
  if (trustProxy !== undefined) app.set('trust proxy', trustProxy);

  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));

  // Public routes (used by the website). No credentials are allowed cross-origin.
  const publicCors = cors({ origin: corsOrigin ? corsOrigin.split(',').map((s) => s.trim()) : false });
  app.get('/api/health', publicCors, (req, res) => {
    res.json({ ok: true, db: isDbConnected() ? 'connected' : 'disconnected' });
  });
  app.use('/api/inquiries', publicCors, inquiries);

  // Staff portal API (sign-in, accounts, audit log).
  if (sessionStore) {
    app.use('/api/staff', createStaffRouter({ sessionStore, sessionSecret, production, staffAppOrigins }));
  }

  app.use((req, res) => res.status(404).json({ error: 'Not found', code: 'not_found' }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // Malformed or oversized bodies. Not logged: the body may contain a password.
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'The request body is not valid JSON.', code: 'invalid_json' });
    }
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'The request is too large.', code: 'too_large' });
    }
    const status = err.expose && err.status >= 400 && err.status < 500 ? err.status : 500;
    if (status === 500) console.error(err.stack || err);
    res.status(status).json({
      error: status === 500 ? 'Something went wrong. Please try again.' : err.message,
      code: status === 500 ? 'server_error' : err.code || 'error',
    });
  });
  return app;
}
