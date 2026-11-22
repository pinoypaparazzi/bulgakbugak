/* =========================================================
   ROLES AND PERMISSIONS — the single source of truth.
   Every protected API route checks a permission from this file
   (see requirePermission in ./middleware.js). The staff app only
   uses the list it receives from GET /api/staff/auth/me to decide
   what to show; it never decides what a user may do.

   To change what a role can do, edit ROLE_PERMISSIONS below and
   update the role matrix in docs/AUTH.md. Deny by default: a
   permission that is not listed for a role is not granted.
   ========================================================= */

export const ROLES = Object.freeze({
  SUPER_DUPER_ADMIN: 'super_duper_admin',
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  INVESTOR: 'investor',
  HR: 'hr',
});

export const ROLE_IDS = Object.freeze(Object.values(ROLES));

export const ROLE_LABELS = Object.freeze({
  [ROLES.SUPER_DUPER_ADMIN]: 'Super Duper Admin',
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.INVESTOR]: 'Investor',
  [ROLES.HR]: 'HR',
});

/* Every permission the system knows about. Several protect modules that
   are not built yet (CRM, bookings, HR, accounting, reports, settings);
   they are defined now so those modules can be added without redesigning
   the access model. Granting one does not make its module exist. */
export const PERMISSIONS = Object.freeze({
  STAFF_ACCOUNTS_READ: 'staff.accounts.read',
  STAFF_ACCOUNTS_CREATE: 'staff.accounts.create',
  STAFF_ACCOUNTS_UPDATE: 'staff.accounts.update',
  STAFF_ACCOUNTS_DEACTIVATE: 'staff.accounts.deactivate',
  STAFF_ROLES_ASSIGN: 'staff.roles.assign',
  CRM_CUSTOMERS_READ: 'crm.customers.read',
  CRM_CUSTOMERS_UPDATE: 'crm.customers.update',
  BOOKINGS_READ: 'bookings.read',
  BOOKINGS_UPDATE: 'bookings.update',
  HR_EMPLOYEES_READ: 'hr.employees.read',
  HR_EMPLOYEES_CREATE: 'hr.employees.create',
  HR_EMPLOYEES_UPDATE: 'hr.employees.update',
  HR_SKILLS_MANAGE: 'hr.skills.manage',
  ACCOUNTING_RECORDS_READ: 'accounting.records.read',
  ACCOUNTING_TRANSACTIONS_READ: 'accounting.transactions.read',
  ACCOUNTING_RECORDS_CREATE: 'accounting.records.create',
  ACCOUNTING_RECORDS_UPDATE: 'accounting.records.update',
  ACCOUNTING_RECORDS_DELETE: 'accounting.records.delete',
  REPORTS_SALES_READ: 'reports.sales.read',
  SYSTEM_SETTINGS_MANAGE: 'system.settings.manage',
  AUDIT_READ: 'audit.read',
});

export const ALL_PERMISSIONS = Object.freeze(Object.values(PERMISSIONS));

const P = PERMISSIONS;

export const ROLE_PERMISSIONS = Object.freeze({
  // Full access to everything the system implements.
  [ROLES.SUPER_DUPER_ADMIN]: ALL_PERMISSIONS,

  // INITIAL CONFIGURATION: the same permissions as Super Duper Admin.
  // The owner has not yet decided which restrictions Super Admin should
  // have; remove permissions here once that decision is made.
  // Regardless of this list, a Super Admin can never assign the Super Duper
  // Admin role or change a Super Duper Admin account (see ASSIGNABLE_ROLES
  // and services/staffAccounts.js).
  [ROLES.SUPER_ADMIN]: ALL_PERMISSIONS,

  // Routine CRM and operations.
  [ROLES.ADMIN]: [P.CRM_CUSTOMERS_READ, P.CRM_CUSTOMERS_UPDATE, P.BOOKINGS_READ, P.BOOKINGS_UPDATE],

  // Read-only financial access. No create/update/delete permission exists for this role.
  [ROLES.INVESTOR]: [P.ACCOUNTING_RECORDS_READ, P.ACCOUNTING_TRANSACTIONS_READ, P.REPORTS_SALES_READ],

  // Employee records and skills only.
  [ROLES.HR]: [P.HR_EMPLOYEES_READ, P.HR_EMPLOYEES_CREATE, P.HR_EMPLOYEES_UPDATE, P.HR_SKILLS_MANAGE],
});

/* Which roles each role may give to an account (when creating it or changing its role).
   A role missing from this map may not assign any role. */
export const ASSIGNABLE_ROLES = Object.freeze({
  [ROLES.SUPER_DUPER_ADMIN]: ROLE_IDS,
  [ROLES.SUPER_ADMIN]: ROLE_IDS.filter((r) => r !== ROLES.SUPER_DUPER_ADMIN),
});

/* Accounts with these roles can only be changed by a Super Duper Admin. */
export const PROTECTED_ROLES = Object.freeze([ROLES.SUPER_DUPER_ADMIN]);

export const isRole = (value) => ROLE_IDS.includes(value);

export const permissionsFor = (role) => [...(ROLE_PERMISSIONS[role] || [])];

export const hasPermission = (role, permission) => (ROLE_PERMISSIONS[role] || []).includes(permission);

export const assignableRolesFor = (role) => [...(ASSIGNABLE_ROLES[role] || [])];

export const canAssignRole = (actorRole, targetRole) => assignableRolesFor(actorRole).includes(targetRole);
