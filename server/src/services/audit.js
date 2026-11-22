import AuditEvent from '../models/AuditEvent.js';

const who = (user) => (user ? { id: user._id, username: user.username, role: user.role } : undefined);

/* Records an audit event. Auditing must never break the action being
   audited, so a failure to write is reported to the server log only.
   Pass `session` to write inside a MongoDB transaction (then errors do
   propagate, so the transaction rolls back). */
export async function recordAudit({ action, outcome = 'success', actor, target, details, req, session }) {
  const doc = {
    action,
    outcome,
    actor: who(actor),
    target: who(target),
    details,
    ip: req?.ip,
  };
  if (session) {
    await AuditEvent.create([doc], { session });
    return;
  }
  try {
    await AuditEvent.create(doc);
  } catch (err) {
    console.error(`Could not write audit event "${action}": ${err.message}`);
  }
}
