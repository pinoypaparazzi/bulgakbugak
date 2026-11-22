/* =========================================================
   STAFF PORTAL AREAS
   What the dashboard and navigation show, filtered by the signed-in
   person's permissions (which come from the server). This only controls
   what is SHOWN; the API checks every permission itself.

   `available: false` marks modules that are planned but not built.
   They are shown as "Not built yet" with no link and no data.
   ========================================================= */
export const MODULES = [
  {
    id: 'accounts',
    title: 'Staff accounts',
    description: 'Create staff accounts, assign roles, deactivate accounts and issue temporary passwords.',
    permission: 'staff.accounts.read',
    icon: 'key',
    available: true,
    to: '/accounts',
  },
  {
    id: 'audit',
    title: 'Audit log',
    description: 'Review sign-ins, password changes and account changes.',
    permission: 'audit.read',
    icon: 'shield',
    available: true,
    to: '/audit',
  },
  {
    id: 'crm',
    title: 'Customers (CRM)',
    description: 'Customer records and request history.',
    permission: 'crm.customers.read',
    icon: 'handshake',
    available: false,
  },
  {
    id: 'bookings',
    title: 'Bookings',
    description: 'Booking requests, statuses and details.',
    permission: 'bookings.read',
    icon: 'calendar',
    available: false,
  },
  {
    id: 'hr-employees',
    title: 'Employee records',
    description: 'Employee information maintained by HR.',
    permission: 'hr.employees.read',
    icon: 'document',
    available: false,
  },
  {
    id: 'hr-skills',
    title: 'Employee skills',
    description: 'Skills, qualifications and competencies.',
    permission: 'hr.skills.manage',
    icon: 'tools',
    available: false,
  },
  {
    id: 'accounting',
    title: 'Accounting records',
    description: 'Accounting records and transaction details.',
    permission: 'accounting.records.read',
    readOnlyUnless: 'accounting.records.update',
    icon: 'receipt',
    available: false,
  },
  {
    id: 'reports',
    title: 'Sales reports',
    description: 'Sales and revenue reports.',
    permission: 'reports.sales.read',
    icon: 'layers',
    available: false,
  },
  {
    id: 'settings',
    title: 'System settings',
    description: 'System-wide configuration.',
    permission: 'system.settings.manage',
    icon: 'wrench',
    available: false,
  },
];

export const modulesFor = (permissions) => MODULES.filter((m) => permissions.includes(m.permission));
