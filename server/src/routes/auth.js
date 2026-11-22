import { Router } from 'express';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import Employee from '../models/Employee.js';
import { verifyPassword, DUMMY_HASH } from '../lib/password.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const INVALID = 'Incorrect email or password.';

// Slow down password guessing: 10 failed attempts per IP + email every 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}|${String(req.body?.email || '').trim().toLowerCase()}`,
  message: { error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' },
});

// POST /api/auth/login  { email, password }
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !password) return res.status(400).json({ error: 'Please enter your email and password.' });

    const employee = await Employee.findOne({ email }).select('+passwordHash');
    const ok = await verifyPassword(password, employee?.passwordHash || DUMMY_HASH);
    if (!employee || !ok) return res.status(401).json({ error: INVALID });
    if (!employee.active) return res.status(403).json({ error: 'This account has been deactivated. Please contact an administrator.' });

    // New session ID on every login (prevents session fixation).
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.employeeId = employee.id;
      req.session.save(async (saveErr) => {
        if (saveErr) return next(saveErr);
        try {
          await Employee.updateOne({ _id: employee._id }, { lastLoginAt: new Date() });
          res.json({ employee: employee.toPublic() });
        } catch (e) {
          next(e);
        }
      });
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  — who is signed in
router.get('/me', requireAuth, (req, res) => {
  res.json({ employee: req.employee.toPublic() });
});

// POST /api/auth/logout
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie(req.app.get('sessionCookieName'), req.app.get('sessionCookieOptions'));
    res.status(204).end();
  });
});

export default router;
