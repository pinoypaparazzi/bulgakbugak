import StaffUser from '../models/StaffUser.js';
import { hasPermission, permissionsFor } from './roles.js';
import { SESSION_ABSOLUTE_MS, SESSION_COOKIE_NAME, cookieOptions, destroySession } from './session.js';
import { forbidden, unauthorized } from '../lib/httpError.js';
import { recordAudit } from '../services/audit.js';

/* =========================================================
   AUTHENTICATION AND AUTHORIZATION MIDDLEWARE
   Order on protected routes:
     requireStaff → requirePasswordChanged → requirePermission(...)
   Nothing the browser sends about roles or permissions is trusted:
   the account is re-read from MongoDB on every request.
   ========================================================= */

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
export const CSRF_HEADER = 'x-ays-csrf';

/* CSRF defence for cookie sessions, on top of SameSite=Strict:
   1. Every state-changing request must carry the custom header
      `X-AYS-CSRF: 1`. Browsers don't let another site add custom headers
      to a cross-site request without a CORS preflight, which we refuse.
   2. If the browser sends an Origin header, it must be this site or one
      of the configured staff app origins. */
export function csrfGuard({ allowedOrigins = [] } = {}) {
  return (req, res, next) => {
    if (SAFE_METHODS.has(req.method)) return next();
    if (req.get(CSRF_HEADER) !== '1') return next(forbidden('This request was blocked for security reasons.', 'csrf_failed'));
    const origin = req.get('origin');
    if (origin) {
      let originHost;
      try {
        originHost = new URL(origin).host;
      } catch {
        return next(forbidden('This request was blocked for security reasons.', 'csrf_failed'));
      }
      if (originHost !== req.get('host') && !allowedOrigins.includes(origin)) {
        return next(forbidden('This request was blocked for security reasons.', 'csrf_failed'));
      }
    }
    next();
  };
}

async function endSession(req, res) {
  await destroySession(req).catch(() => {});
  res.clearCookie(SESSION_COOKIE_NAME, cookieOptions(req.app.get('production')));
}

/* Signed in, account still active, and session still valid.
   Sets req.staff (the account) and req.permissions. */
export async function requireStaff(req, res, next) {
  try {
    const s = req.session;
    if (!s?.staffUserId) return next(unauthorized());

    if (!s.authenticatedAt || Date.now() - s.authenticatedAt > SESSION_ABSOLUTE_MS) {
      await endSession(req, res);
      return next(unauthorized('session_expired', 'Your session has expired. Please sign in again.'));
    }

    const user = await StaffUser.findById(s.staffUserId).select('+sessionVersion');
    // Deactivated, deleted, or changed since this session started (password,
    // role or status change): the session is no longer valid.
    if (!user || user.status !== 'active' || user.sessionVersion !== s.sessionVersion) {
      await endSession(req, res);
      return next(unauthorized('session_expired', 'Your session has ended. Please sign in again.'));
    }

    req.staff = user;
    req.permissions = permissionsFor(user.role);
    next();
  } catch (err) {
    next(err);
  }
}

/* Blocks everything except the password-change flow until a required
   password change (first sign-in, or after a reset) is done. */
export function requirePasswordChanged(req, res, next) {
  if (req.staff?.mustChangePassword) {
    return next(forbidden('You need to change your password before continuing.', 'password_change_required'));
  }
  next();
}

/* The signed-in account's role must have every listed permission. */
export function requirePermission(...permissions) {
  if (permissions.length === 0) throw new Error('requirePermission needs at least one permission');
  return (req, res, next) => {
    const role = req.staff?.role;
    const missing = permissions.filter((p) => !hasPermission(role, p));
    if (!role || missing.length) {
      recordAudit({
        action: 'access.denied',
        outcome: 'denied',
        actor: req.staff,
        details: { method: req.method, path: req.originalUrl.split('?')[0], missing },
        req,
      });
      return next(forbidden());
    }
    next();
  };
}
