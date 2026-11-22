import { Router } from 'express';
import cors from 'cors';
import { createSessionMiddleware } from '../../auth/session.js';
import { csrfGuard, requirePasswordChanged, requireStaff } from '../../auth/middleware.js';
import { notFound } from '../../lib/httpError.js';
import authRoutes from './auth.js';
import accountRoutes from './accounts.js';
import auditRoutes from './audit.js';

/* Everything under /api/staff. Order matters:
   no-store caching → session → CSRF check → routes. */
export function createStaffRouter({ sessionStore, sessionSecret, production, staffAppOrigins = [] }) {
  const router = Router();

  // Only needed if the staff app is ever served from a different origin than
  // this API. Credentialed CORS is allowed for the listed origins only.
  if (staffAppOrigins.length) {
    router.use(cors({ origin: staffAppOrigins, credentials: true, allowedHeaders: ['Content-Type', 'X-AYS-CSRF'] }));
  }
  // Staff responses can contain private data: never cache them.
  router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  router.use(createSessionMiddleware({ store: sessionStore, secret: sessionSecret, production }));
  router.use(csrfGuard({ allowedOrigins: staffAppOrigins }));

  router.use('/auth', authRoutes);
  router.use('/accounts', requireStaff, requirePasswordChanged, accountRoutes);
  router.use('/audit', requireStaff, requirePasswordChanged, auditRoutes);

  router.use((req, res, next) => next(notFound()));
  return router;
}
