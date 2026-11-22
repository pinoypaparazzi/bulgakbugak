import mongoose from 'mongoose';

/* =========================================================
   AUDIT EVENT — a record of a security-relevant action.
   Collection: audit_events
   Append-only: the API has no route that edits or deletes events.
   Never put passwords, password hashes, session IDs or temporary
   passwords in `details`.
   ========================================================= */
const actorSchema = new mongoose.Schema(
  { id: mongoose.Schema.Types.ObjectId, username: String, role: String },
  { _id: false },
);

const auditEventSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    outcome: { type: String, enum: ['success', 'failure', 'denied'], default: 'success' },
    actor: { type: actorSchema },
    target: { type: actorSchema },
    details: { type: mongoose.Schema.Types.Mixed },
    ip: { type: String },
  },
  { collection: 'audit_events', timestamps: { createdAt: true, updatedAt: false } },
);

auditEventSchema.index({ createdAt: -1 });
auditEventSchema.index({ 'target.id': 1, createdAt: -1 });

export default mongoose.model('AuditEvent', auditEventSchema);
