import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_PERMISSIONS,
  ROLES,
  ROLE_IDS,
  assignableRolesFor,
  canAssignRole,
  hasPermission,
  permissionsFor,
} from '../src/auth/roles.js';
import { checkPasswordPolicy, generateTemporaryPassword } from '../src/auth/password.js';

const sorted = (a) => [...a].sort();

test('there are exactly five roles with stable identifiers', () => {
  assert.deepEqual(sorted(ROLE_IDS), sorted(['super_duper_admin', 'super_admin', 'admin', 'investor', 'hr']));
});

test('Super Duper Admin has every permission', () => {
  assert.deepEqual(sorted(permissionsFor(ROLES.SUPER_DUPER_ADMIN)), sorted(ALL_PERMISSIONS));
});

test('Super Admin initial configuration and assignment limits', () => {
  assert.ok(hasPermission(ROLES.SUPER_ADMIN, 'staff.accounts.create'));
  assert.ok(!canAssignRole(ROLES.SUPER_ADMIN, ROLES.SUPER_DUPER_ADMIN), 'Super Admin must never assign Super Duper Admin');
  for (const r of [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INVESTOR, ROLES.HR]) assert.ok(canAssignRole(ROLES.SUPER_ADMIN, r));
});

test('Admin: CRM and bookings only', () => {
  assert.deepEqual(sorted(permissionsFor(ROLES.ADMIN)), sorted(['crm.customers.read', 'crm.customers.update', 'bookings.read', 'bookings.update']));
});

test('Investor: read-only accounting and reports, no write permissions', () => {
  const perms = permissionsFor(ROLES.INVESTOR);
  assert.deepEqual(sorted(perms), sorted(['accounting.records.read', 'accounting.transactions.read', 'reports.sales.read']));
  for (const p of perms) assert.match(p, /\.read$/, `${p} must be read-only`);
});

test('HR: employee records and skills only', () => {
  assert.deepEqual(sorted(permissionsFor(ROLES.HR)), sorted(['hr.employees.read', 'hr.employees.create', 'hr.employees.update', 'hr.skills.manage']));
});

test('Admin, Investor and HR cannot manage staff accounts or assign roles', () => {
  for (const role of [ROLES.ADMIN, ROLES.INVESTOR, ROLES.HR]) {
    for (const p of ['staff.accounts.read', 'staff.accounts.create', 'staff.accounts.update', 'staff.accounts.deactivate', 'staff.roles.assign', 'system.settings.manage', 'audit.read']) {
      assert.ok(!hasPermission(role, p), `${role} must not have ${p}`);
    }
    assert.deepEqual(assignableRolesFor(role), []);
  }
});

test('cross-role boundaries: Admin no HR/accounting, HR no accounting, Investor no HR/CRM', () => {
  assert.ok(!permissionsFor(ROLES.ADMIN).some((p) => p.startsWith('hr.') || p.startsWith('accounting.') || p.startsWith('reports.')));
  assert.ok(!permissionsFor(ROLES.HR).some((p) => p.startsWith('accounting.') || p.startsWith('reports.') || p.startsWith('crm.') || p.startsWith('bookings.')));
  assert.ok(!permissionsFor(ROLES.INVESTOR).some((p) => p.startsWith('hr.') || p.startsWith('crm.') || p.startsWith('bookings.')));
});

test('unknown roles get nothing (deny by default)', () => {
  assert.deepEqual(permissionsFor('owner'), []);
  assert.ok(!hasPermission(undefined, 'staff.accounts.read'));
  assert.ok(!canAssignRole('owner', ROLES.ADMIN));
});

test('password policy', () => {
  assert.equal(checkPasswordPolicy('short'), 'Use at least 12 characters.');
  assert.match(checkPasswordPolicy('juan-delacruz-2026', { username: 'juan-delacruz' }), /username/);
  assert.match(checkPasswordPolicy('password1234'), /too common/);
  assert.match(checkPasswordPolicy('aaaaaaaaaaaaaa'), /repeated/);
  assert.match(checkPasswordPolicy(' padded password '), /space/);
  assert.equal(checkPasswordPolicy('correct horse battery'), null);
});

test('temporary passwords are random and meet the policy', () => {
  const a = generateTemporaryPassword();
  const b = generateTemporaryPassword();
  assert.notEqual(a, b);
  assert.match(a, /^[A-Za-z2-9]{4}(-[A-Za-z2-9]{4}){3}$/);
  assert.equal(checkPasswordPolicy(a), null);
});
