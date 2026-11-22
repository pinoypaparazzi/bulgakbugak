import { Router } from 'express';
import { PERMISSIONS as P } from '../../auth/roles.js';
import { requirePermission } from '../../auth/middleware.js';
import {
  createStaffAccount,
  getStaffAccount,
  listStaffAccounts,
  resetStaffPassword,
  updateStaffAccount,
} from '../../services/staffAccounts.js';

/* Mounted at /api/staff/accounts behind requireStaff + requirePasswordChanged.
   Each route checks its base permission here; services/staffAccounts.js
   applies the per-account rules (protected accounts, assignable roles,
   no self-changes). */
const router = Router();

const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

// GET /api/staff/accounts
router.get('/', requirePermission(P.STAFF_ACCOUNTS_READ), wrap(async (req, res) => {
  res.json({ accounts: await listStaffAccounts() });
}));

// POST /api/staff/accounts  { username, displayName, role }
// Responds with a one-time temporary password; the new person must change it at first sign-in.
router.post('/', requirePermission(P.STAFF_ACCOUNTS_CREATE), wrap(async (req, res) => {
  res.status(201).json(await createStaffAccount(req.staff, req.body, req));
}));

// GET /api/staff/accounts/:id
router.get('/:id', requirePermission(P.STAFF_ACCOUNTS_READ), wrap(async (req, res) => {
  res.json({ account: await getStaffAccount(req.params.id) });
}));

// PATCH /api/staff/accounts/:id  { displayName?, role?, status? }
router.patch('/:id', requirePermission(P.STAFF_ACCOUNTS_READ), wrap(async (req, res) => {
  res.json({ account: await updateStaffAccount(req.staff, req.params.id, req.body, req) });
}));

// POST /api/staff/accounts/:id/reset-password  — issues a new temporary password
router.post('/:id/reset-password', requirePermission(P.STAFF_ACCOUNTS_UPDATE), wrap(async (req, res) => {
  res.json(await resetStaffPassword(req.staff, req.params.id, req));
}));

export default router;
