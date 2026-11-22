import mongoose from 'mongoose';

/* =========================================================
   SYSTEM STATE — one-off markers the system needs to remember.
   Collection: system_state
   The `_id` is the marker name, so each marker can exist only once.
   Used by the Super Duper Admin bootstrap: the document
   { _id: 'staff_bootstrap' } means bootstrap has already run and may
   not run again.
   ========================================================= */
const systemStateSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { collection: 'system_state', timestamps: true },
);

export const BOOTSTRAP_MARKER = 'staff_bootstrap';

export default mongoose.model('SystemState', systemStateSchema);
