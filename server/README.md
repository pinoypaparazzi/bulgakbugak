# AT YOUR SERVICE API

Express 5 + MongoDB (Mongoose) backend for the public website and the staff portal.
Full sign-in, roles and permissions documentation: [`../docs/AUTH.md`](../docs/AUTH.md).

## Setup
1. `cd server && npm install`
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI`, `MONGODB_DB_NAME` and `SESSION_SECRET`.
3. `npm run dev` (restarts on file changes). The API runs on http://localhost:4000.

On start-up the API creates any missing staff collections and indexes (it never drops data).
The staff app's dev server forwards `/api/*` to this API.

## Commands
| Command | What it does |
| --- | --- |
| `npm run dev` | Start with auto-restart |
| `npm start` | Start |
| `npm test` | 58 automated tests against a throwaway in-memory MongoDB (never touches Atlas) |
| `npm run bootstrap:super-duper-admin` | One-time creation of the first Super Duper Admin (interactive, see docs/AUTH.md §5) |

## Routes
Public:
- `GET /api/health`: status and database connection state
- `POST /api/inquiries`: save a booking request (validated with the website's `src/lib/inquiry.js` rules)

Staff (session cookie + `X-AYS-CSRF: 1` header on changes):
- `POST /api/staff/auth/login`, `POST /api/staff/auth/logout`, `GET /api/staff/auth/me`, `POST /api/staff/auth/change-password`
- `GET|POST /api/staff/accounts`, `GET|PATCH /api/staff/accounts/:id`, `POST /api/staff/accounts/:id/reset-password`
- `GET /api/staff/audit`

## Where things are
| Path | Purpose |
| --- | --- |
| `src/auth/roles.js` | **The** role and permission list (edit here to change access) |
| `src/auth/middleware.js` | `requireStaff`, `requirePasswordChanged`, `requirePermission`, CSRF guard |
| `src/auth/session.js` | Session cookie settings and timeouts |
| `src/auth/password.js` | Argon2id hashing, password policy, temporary passwords |
| `src/services/staffAccounts.js` | Account rules (protected accounts, assignable roles, no self-changes) |
| `src/services/bootstrap.js` | One-time Super Duper Admin creation |
| `src/routes/staff/` | Staff API routes |
| `src/models/` | `StaffUser`, `AuditEvent`, `SystemState`, `Inquiry` |
| `test/` | Automated tests (`node --test`) |
