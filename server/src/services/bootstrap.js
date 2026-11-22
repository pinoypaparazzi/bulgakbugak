import mongoose from 'mongoose';
import StaffUser from '../models/StaffUser.js';
import SystemState, { BOOTSTRAP_MARKER } from '../models/SystemState.js';
import { ROLES } from '../auth/roles.js';
import { BOOTSTRAP_PASSWORD_MIN_LENGTH, checkPasswordPolicy, hashPassword } from '../auth/password.js';
import { checkDisplayName, checkUsername, normalizeDisplayName, normalizeUsername } from '../lib/validate.js';
import { recordAudit } from './audit.js';

/* =========================================================
   ONE-TIME SUPER DUPER ADMIN BOOTSTRAP
   Called only by scripts/bootstrap-super-duper-admin.js, which runs on
   the command line. There is deliberately NO web endpoint for this.

   In a single MongoDB transaction it:
     1. refuses if the bootstrap marker exists or any Super Duper Admin exists,
     2. writes the marker { _id: 'staff_bootstrap' } (unique, so two runs
        can't both succeed),
     3. creates the account with mustChangePassword = true,
     4. writes an audit event.
   Either all of it happens or none of it does. Once the marker exists,
   bootstrap is permanently disabled. Further accounts are created in the
   staff app by a Super Duper Admin or Super Admin.
   ========================================================= */

export class BootstrapError extends Error {}

export async function bootstrapSuperDuperAdmin({ username: rawUsername, displayName: rawName, password }) {
  const username = normalizeUsername(rawUsername);
  const displayName = normalizeDisplayName(rawName);
  const problem =
    checkUsername(username) ||
    checkDisplayName(displayName) ||
    checkPasswordPolicy(password, { username, minLength: BOOTSTRAP_PASSWORD_MIN_LENGTH });
  if (problem) throw new BootstrapError(problem);

  const passwordHash = await hashPassword(password);
  const session = await mongoose.startSession();
  try {
    let created;
    await session.withTransaction(async () => {
      if (await SystemState.exists({ _id: BOOTSTRAP_MARKER }).session(session)) {
        throw new BootstrapError('Bootstrap has already been completed. It can only run once.');
      }
      if (await StaffUser.exists({ role: ROLES.SUPER_DUPER_ADMIN }).session(session)) {
        throw new BootstrapError('A Super Duper Admin account already exists. Bootstrap is not allowed.');
      }
      await SystemState.create([{ _id: BOOTSTRAP_MARKER, value: { completedAt: new Date(), username } }], { session });
      [created] = await StaffUser.create(
        [{ username, displayName, role: ROLES.SUPER_DUPER_ADMIN, passwordHash, mustChangePassword: true }],
        { session },
      );
      await recordAudit({ action: 'staff.bootstrap', target: created, details: { role: created.role }, session });
    });
    return created;
  } catch (err) {
    if (err instanceof BootstrapError) throw err;
    if (err?.code === 11000) {
      throw new BootstrapError('Bootstrap has already been completed, or that username is already in use.');
    }
    if (/Transaction numbers are only allowed|replica set/i.test(err?.message || '')) {
      throw new BootstrapError('This MongoDB server does not support transactions. Use MongoDB Atlas or a replica set.');
    }
    throw err;
  } finally {
    await session.endSession();
  }
}
