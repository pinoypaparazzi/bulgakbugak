import { Router } from 'express';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import StaffUser from '../../models/StaffUser.js';
import { ROLE_LABELS, assignableRolesFor, permissionsFor } from '../../auth/roles.js';
import {
  PASSWORD_MAX_LENGTH,
  checkPasswordPolicy,
  getDummyHash,
  hashPassword,
  needsRehash,
  verifyPassword,
} from '../../auth/password.js';
import { SESSION_COOKIE_NAME, cookieOptions, destroySession, startSession } from '../../auth/session.js';
import { requireStaff } from '../../auth/middleware.js';
import { normalizeUsername, onlyFields } from '../../lib/validate.js';
import { HttpError, badRequest, unauthorized } from '../../lib/httpError.js';
import { recordAudit } from '../../services/audit.js';

const router = Router();

const INVALID_CREDENTIALS = 'Incorrect username or password.';

const tooMany = (message) => (req, res, next, options) => next(new HttpError(options.statusCode, 'rate_limited', message));

/* Sign-in abuse limits (kept in this server's memory; see docs/AUTH.md):
   - 10 failed attempts per IP address + username every 15 minutes,
   - 50 sign-in requests per IP address every 15 minutes. */
const loginPerAccount = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}|${normalizeUsername(req.body?.username).slice(0, 64)}`,
  handler: tooMany('Too many sign-in attempts. Please wait 15 minutes and try again.'),
});
const loginPerIp = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  handler: tooMany('Too many sign-in attempts from this network. Please wait 15 minutes and try again.'),
});
const changePasswordLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => `pw|${req.session?.staffUserId || ipKeyGenerator(req.ip)}`,
  handler: tooMany('Too many attempts. Please wait 15 minutes and try again.'),
});

/* What the staff app needs to know about the signed-in person. */
function mePayload(user) {
  return {
    user: user.toPublic(),
    roleLabel: ROLE_LABELS[user.role],
    permissions: permissionsFor(user.role),
    assignableRoles: assignableRolesFor(user.role).map((id) => ({ id, label: ROLE_LABELS[id] })),
  };
}

// POST /api/staff/auth/login  { username, password }
router.post('/login', loginPerIp, loginPerAccount, async (req, res, next) => {
  try {
    if (onlyFields(req.body, ['username', 'password'])) throw badRequest('Please enter your username and password.');
    const username = normalizeUsername(req.body.username);
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!username || !password) throw badRequest('Please enter your username and password.');
    if (username.length > 64 || password.length > PASSWORD_MAX_LENGTH) throw unauthorized('invalid_credentials', INVALID_CREDENTIALS);

    const user = await StaffUser.findOne({ username }).select('+passwordHash +sessionVersion');
    // Always run one password check, so a missing username takes as long as a wrong password.
    const ok = await verifyPassword(user ? user.passwordHash : await getDummyHash(), password);

    if (!user || !ok) {
      // Unknown usernames are not recorded (people sometimes type a password into the username box).
      if (user) await recordAudit({ action: 'staff.login', outcome: 'failure', target: user, req });
      throw unauthorized('invalid_credentials', INVALID_CREDENTIALS);
    }
    if (user.status !== 'active') {
      // Only said after the correct password, so it reveals nothing to someone guessing.
      await recordAudit({ action: 'staff.login', outcome: 'denied', target: user, details: { reason: 'deactivated' }, req });
      throw new HttpError(403, 'account_deactivated', 'This account has been deactivated. Please contact an administrator.');
    }

    const set = { lastLoginAt: new Date() };
    if (needsRehash(user.passwordHash)) set.passwordHash = await hashPassword(password);
    await StaffUser.updateOne({ _id: user._id }, { $set: set });

    await startSession(req, user, user.sessionVersion);
    await recordAudit({ action: 'staff.login', actor: user, target: user, req });
    res.json(mePayload(user));
  } catch (err) {
    next(err);
  }
});

// POST /api/staff/auth/logout
router.post('/logout', async (req, res, next) => {
  try {
    const userId = req.session?.staffUserId;
    if (userId) {
      const user = await StaffUser.findById(userId);
      if (user) await recordAudit({ action: 'staff.logout', actor: user, target: user, req });
    }
    await destroySession(req);
    res.clearCookie(SESSION_COOKIE_NAME, cookieOptions(req.app.get('production')));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// GET /api/staff/auth/me  — allowed even while a password change is required
router.get('/me', requireStaff, (req, res) => {
  res.json(mePayload(req.staff));
});

// POST /api/staff/auth/change-password  { currentPassword, newPassword }
router.post('/change-password', requireStaff, changePasswordLimit, async (req, res, next) => {
  try {
    if (onlyFields(req.body, ['currentPassword', 'newPassword'])) throw badRequest('Please fill in both password fields.');
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== 'string' || !currentPassword || typeof newPassword !== 'string') {
      throw badRequest('Please fill in both password fields.');
    }

    const user = await StaffUser.findById(req.staff._id).select('+passwordHash +sessionVersion');
    if (currentPassword.length > PASSWORD_MAX_LENGTH || !(await verifyPassword(user.passwordHash, currentPassword))) {
      await recordAudit({ action: 'staff.password.change', outcome: 'failure', actor: user, target: user, req });
      throw badRequest('Your current password is incorrect.', 'wrong_current_password');
    }
    const problem = checkPasswordPolicy(newPassword, { username: user.username });
    if (problem) throw badRequest(problem, 'weak_password');
    if (await verifyPassword(user.passwordHash, newPassword)) {
      throw badRequest('Your new password must be different from your current one.', 'weak_password');
    }

    // Applies only if no other change happened since this session started.
    // sessionVersion + 1 signs out every other session for this account.
    const updated = await StaffUser.findOneAndUpdate(
      { _id: user._id, sessionVersion: user.sessionVersion, status: 'active' },
      {
        $set: { passwordHash: await hashPassword(newPassword), mustChangePassword: false, passwordChangedAt: new Date() },
        $inc: { sessionVersion: 1 },
      },
      { returnDocument: 'after' },
    ).select('+sessionVersion');
    if (!updated) throw unauthorized('session_expired', 'Your session has ended. Please sign in again.');

    // A fresh session for this browser, tied to the new version.
    await startSession(req, updated, updated.sessionVersion);
    await recordAudit({ action: 'staff.password.change', actor: updated, target: updated, req });
    res.json(mePayload(updated));
  } catch (err) {
    next(err);
  }
});

export default router;
