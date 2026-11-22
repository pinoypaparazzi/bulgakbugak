import { Router } from 'express';
import AuditEvent from '../../models/AuditEvent.js';
import { PERMISSIONS as P } from '../../auth/roles.js';
import { requirePermission } from '../../auth/middleware.js';

/* Mounted at /api/staff/audit behind requireStaff + requirePasswordChanged. Read-only. */
const router = Router();

// GET /api/staff/audit?limit=100  — most recent events first (max 200)
router.get('/', requirePermission(P.AUDIT_READ), async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 200);
    const events = await AuditEvent.find().sort({ createdAt: -1 }).limit(limit).lean();
    res.json({
      events: events.map((e) => ({
        id: String(e._id),
        action: e.action,
        outcome: e.outcome,
        actor: e.actor ? { id: String(e.actor.id), username: e.actor.username, role: e.actor.role } : null,
        target: e.target ? { id: String(e.target.id), username: e.target.username, role: e.target.role } : null,
        details: e.details ?? null,
        ip: e.ip ?? null,
        createdAt: e.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
