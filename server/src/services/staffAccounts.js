import StaffUser from '../models/StaffUser.js';
import { PERMISSIONS, PROTECTED_ROLES, ROLES, ROLE_LABELS, canAssignRole, hasPermission, isRole } from '../auth/roles.js';
import { generateTemporaryPassword, hashPassword } from '../auth/password.js';
import {
  checkDisplayName,
  checkUsername,
  isObjectId,
  normalizeDisplayName,
  normalizeUsername,
  onlyFields,
} from '../lib/validate.js';
import { badRequest, conflict, forbidden, notFound } from '../lib/httpError.js';
import { recordAudit } from './audit.js';

/* =========================================================
   STAFF ACCOUNT MANAGEMENT RULES
   Route middleware has already checked that the actor is signed in,
   active and has the route's base permission. The rules here cover
   what depends on the specific account and change:
   - You can't change your own role or status, or reset your own
     password here (use "Change password"): no self-elevation, no
     accidental self-lockout.
   - Only a Super Duper Admin can change a Super Duper Admin account.
   - A role can only be given by someone whose role may assign it
     (ASSIGNABLE_ROLES): a Super Admin can never assign Super Duper Admin.
   - Each kind of change needs its own permission.
   - Role, status and password changes end the account's existing
     sessions (sessionVersion + 1).
   ========================================================= */

const P = PERMISSIONS;

function requireActorPermission(actor, permission) {
  if (!hasPermission(actor.role, permission)) throw forbidden();
}

function assertCanManage(actor, target) {
  if (String(actor._id) === String(target._id)) {
    throw forbidden('You can’t change your own account here. Use “Change password” for your password.', 'self_change_forbidden');
  }
  if (PROTECTED_ROLES.includes(target.role) && actor.role !== ROLES.SUPER_DUPER_ADMIN) {
    throw forbidden('Only a Super Duper Admin can change this account.', 'protected_account');
  }
}

async function findTarget(id) {
  if (!isObjectId(id)) throw notFound('Account not found.');
  const target = await StaffUser.findById(id);
  if (!target) throw notFound('Account not found.');
  return target;
}

export async function listStaffAccounts() {
  const users = await StaffUser.find().sort({ status: 1, username: 1 }).limit(500);
  return users.map((u) => u.toPublic());
}

export async function getStaffAccount(id) {
  return (await findTarget(id)).toPublic();
}

export async function createStaffAccount(actor, body, req) {
  const shape = onlyFields(body, ['username', 'displayName', 'role']);
  if (shape) throw badRequest(shape);

  const username = normalizeUsername(body.username);
  const displayName = normalizeDisplayName(body.displayName);
  const problem = checkUsername(username) || checkDisplayName(displayName);
  if (problem) throw badRequest(problem);
  if (!isRole(body.role)) throw badRequest('Please choose a valid role.');
  requireActorPermission(actor, P.STAFF_ROLES_ASSIGN);
  if (!canAssignRole(actor.role, body.role)) {
    throw forbidden(`You can’t create ${ROLE_LABELS[body.role]} accounts.`, 'role_not_assignable');
  }

  const temporaryPassword = generateTemporaryPassword();
  let user;
  try {
    user = await StaffUser.create({
      username,
      displayName,
      role: body.role,
      passwordHash: await hashPassword(temporaryPassword),
      mustChangePassword: true,
      createdBy: actor._id,
    });
  } catch (err) {
    // The unique index decides, so two simultaneous requests can't both succeed.
    if (err?.code === 11000) throw conflict('That username is already taken.', 'username_taken');
    throw err;
  }
  await recordAudit({ action: 'staff.account.created', actor, target: user, details: { role: user.role }, req });
  return { user: user.toPublic(), temporaryPassword };
}

export async function updateStaffAccount(actor, id, body, req) {
  const shape = onlyFields(body, ['displayName', 'role', 'status']);
  if (shape) throw badRequest(shape);
  const target = await findTarget(id);
  assertCanManage(actor, target);

  const set = {};
  const changes = {};
  let endSessions = false;

  if (body.displayName !== undefined) {
    requireActorPermission(actor, P.STAFF_ACCOUNTS_UPDATE);
    const displayName = normalizeDisplayName(body.displayName);
    const problem = checkDisplayName(displayName);
    if (problem) throw badRequest(problem);
    if (displayName !== target.displayName) {
      set.displayName = displayName;
      changes.displayName = { from: target.displayName, to: displayName };
    }
  }

  if (body.role !== undefined) {
    requireActorPermission(actor, P.STAFF_ROLES_ASSIGN);
    if (!isRole(body.role)) throw badRequest('Please choose a valid role.');
    if (!canAssignRole(actor.role, body.role)) {
      throw forbidden(`You can’t assign the ${ROLE_LABELS[body.role]} role.`, 'role_not_assignable');
    }
    if (body.role !== target.role) {
      set.role = body.role;
      changes.role = { from: target.role, to: body.role };
      endSessions = true;
    }
  }

  if (body.status !== undefined) {
    requireActorPermission(actor, P.STAFF_ACCOUNTS_DEACTIVATE);
    if (!['active', 'deactivated'].includes(body.status)) throw badRequest('Status must be "active" or "deactivated".');
    if (body.status !== target.status) {
      set.status = body.status;
      changes.status = { from: target.status, to: body.status };
      endSessions = true;
      if (body.status === 'deactivated') {
        set.deactivatedAt = new Date();
        set.deactivatedBy = actor._id;
      } else {
        set.deactivatedAt = null;
        set.deactivatedBy = null;
      }
    }
  }

  if (Object.keys(changes).length === 0) return target.toPublic();

  // Defence in depth: never leave the system without an active Super Duper Admin.
  const removesSuperDuperAdmin =
    target.role === ROLES.SUPER_DUPER_ADMIN && ((set.role && set.role !== target.role) || set.status === 'deactivated');
  if (removesSuperDuperAdmin) {
    const others = await StaffUser.countDocuments({ role: ROLES.SUPER_DUPER_ADMIN, status: 'active', _id: { $ne: target._id } });
    if (others === 0) throw conflict('At least one active Super Duper Admin account must remain.', 'last_super_duper_admin');
  }

  // Only apply the change if the account still has the role and status we
  // checked above, so a simultaneous change can't slip past these rules.
  const update = { $set: set };
  if (endSessions) update.$inc = { sessionVersion: 1 };
  const updated = await StaffUser.findOneAndUpdate({ _id: target._id, role: target.role, status: target.status }, update, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!updated) throw conflict('This account was changed by someone else. Reload and try again.', 'stale_update');

  await recordAudit({ action: 'staff.account.updated', actor, target: updated, details: changes, req });
  return updated.toPublic();
}

export async function resetStaffPassword(actor, id, req) {
  const target = await findTarget(id);
  assertCanManage(actor, target);
  requireActorPermission(actor, P.STAFF_ACCOUNTS_UPDATE);

  const temporaryPassword = generateTemporaryPassword();
  const updated = await StaffUser.findOneAndUpdate(
    { _id: target._id, role: target.role },
    {
      $set: { passwordHash: await hashPassword(temporaryPassword), mustChangePassword: true, passwordChangedAt: new Date() },
      $inc: { sessionVersion: 1 },
    },
    { returnDocument: 'after' },
  );
  if (!updated) throw conflict('This account was changed by someone else. Reload and try again.', 'stale_update');

  await recordAudit({ action: 'staff.account.password_reset', actor, target: updated, req });
  return { user: updated.toPublic(), temporaryPassword };
}
