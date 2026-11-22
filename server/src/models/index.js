import StaffUser from './StaffUser.js';
import AuditEvent from './AuditEvent.js';
import SystemState from './SystemState.js';

/* Creates the collections and indexes the staff portal relies on (most
   importantly the unique username index) before the server accepts
   requests. Safe to run repeatedly: existing indexes and data are kept.
   It only adds what is missing and never drops anything. */
export async function ensureIndexes() {
  for (const model of [StaffUser, AuditEvent, SystemState]) {
    await model.createCollection().catch((err) => {
      if (err?.codeName !== 'NamespaceExists') throw err;
    });
    await model.createIndexes();
  }
}
