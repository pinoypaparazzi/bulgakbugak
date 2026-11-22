# Staff portal: sign-in, roles and permissions

_Last updated: 2026-11-22. Describes what is implemented, not plans, unless marked "Not built yet"._

## 1. The pieces

| Part | Where | What it does |
| --- | --- | --- |
| Staff app | `staff/` (React + Vite, port 5174 locally) | Sign-in page, forced password change, role-aware dashboard, staff accounts, audit log |
| API | `server/` (Express 5, port 4000 locally) | Checks passwords, keeps sessions, enforces every permission |
| Database | MongoDB Atlas (Mongoose) | Staff accounts, sessions, audit events, bootstrap marker |

The staff app never decides what someone may do. It asks the API (`GET /api/staff/auth/me`) and only uses the answer to choose what to **show**. Every protected API route checks the permission itself, so a hidden button or a hand-written request can't bypass anything.

Locally, the staff app's dev server forwards `/api/*` to the API, so the app and API share one origin and the session cookie is first-party.

## 2. How sign-in works

1. The person enters a username and password on `/login`.
2. `POST /api/staff/auth/login` looks up the username (stored lowercase) and checks the password against its **Argon2id** hash. If the username doesn't exist, a dummy hash is checked anyway, so both cases take the same time and return the same message: "Incorrect username or password."
3. On success the server starts a **new session** (new ID, which prevents session fixation) and sets the cookie `ays_staff_sid`.
4. If the account must change its password (first sign-in, or after a reset), the app goes to `/change-password`. Until that's done, the API refuses every protected route with `403 password_change_required`, whatever the browser asks for.

### Sessions

| Setting | Value |
| --- | --- |
| Storage | MongoDB collection `sessions` (via `express-session` + `connect-mongo`). The browser only holds a random ID |
| Cookie | `HttpOnly`, `SameSite=Strict`, `Path=/api/staff`, `Secure` when `NODE_ENV=production` |
| Idle timeout | 2 hours without activity |
| Absolute timeout | 12 hours after sign-in |
| Ends when | Sign-out; the person's password, role or status changes; the account is deactivated; a timeout passes |

Every account has a `sessionVersion` number. Changing the password, role or status adds 1, and any session made with the old number is refused on its next request. This is how deactivation, role changes and password resets take effect immediately, including on other devices.

### CSRF protection

- `SameSite=Strict` cookies aren't sent on requests started by other websites.
- Every change request must include the header `X-AYS-CSRF: 1`. Browsers won't let another site add that header without a CORS preflight, which the API refuses.
- If an `Origin` header is present, it must be this site (or a listed `STAFF_APP_ORIGINS` entry).

### Abuse limits

- 10 failed sign-ins per IP address + username per 15 minutes, then `429`.
- 50 sign-in requests per IP address per 15 minutes.
- 10 failed password-change attempts per session per 15 minutes.

These counters live in the API server's memory. If the API is ever run as several instances, move them to a shared store (for example MongoDB). Accounts are not locked after failures, because lockouts let anyone block a known username.

## 3. Roles and permissions

Defined in one place: [`server/src/auth/roles.js`](../server/src/auth/roles.js). A permission not listed for a role is denied.

| Permission | Super Duper Admin | Super Admin* | Admin | Investor | HR |
| --- | :-: | :-: | :-: | :-: | :-: |
| `staff.accounts.read` / `.create` / `.update` / `.deactivate` | ✔ | ✔ | | | |
| `staff.roles.assign` | ✔ | ✔ (never Super Duper Admin) | | | |
| `crm.customers.read` / `.update` | ✔ | ✔ | ✔ | | |
| `bookings.read` / `.update` | ✔ | ✔ | ✔ | | |
| `hr.employees.read` / `.create` / `.update`, `hr.skills.manage` | ✔ | ✔ | | | ✔ |
| `accounting.records.read`, `accounting.transactions.read`, `reports.sales.read` | ✔ | ✔ | | ✔ (read-only) | |
| `accounting.records.create` / `.update` / `.delete` | ✔ | ✔ | | | |
| `system.settings.manage` | ✔ | ✔ | | | |
| `audit.read` | ✔ | ✔ | | | |

\* **Owner decision pending:** Super Admin currently has the same permission list as Super Duper Admin. The owner has said Super Admin will have restrictions but hasn't defined them yet. To restrict it, remove permissions from `ROLE_PERMISSIONS[super_admin]` in `roles.js`. No other code needs to change.

Rules that apply on top of the permission list, whatever it says (`server/src/services/staffAccounts.js`):

- Only a **Super Duper Admin** can create a Super Duper Admin or give someone that role.
- Only a Super Duper Admin can rename, change the role of, deactivate or reset the password of a Super Duper Admin account.
- Nobody can change their **own** role or status, or reset their own password through account management. Your own password is changed with "Change password", which requires your current password.
- The last active Super Duper Admin can't be demoted or deactivated.
- Changes check that the account hasn't changed since it was read, so two simultaneous edits can't slip past these rules.

### What is actually built

| Area | Status |
| --- | --- |
| Sign-in, sign-out, forced and voluntary password change | Built |
| Staff accounts (create, rename, change role, deactivate/reactivate, reset password) | Built |
| Audit log (read-only list of the latest 100 events) | Built |
| Customers (CRM), Bookings, Employee records, Employee skills, Accounting records, Sales reports, System settings | **Not built yet.** Permissions exist so these modules can be added later. The dashboard shows them as "Not built yet" with no data |

## 4. Data in MongoDB

| Collection | Contents | Indexes |
| --- | --- | --- |
| `staff_users` | `username` (unique, lowercase), `displayName`, `role`, `status` (`active`/`deactivated`), `passwordHash` (Argon2id, never returned by the API), `mustChangePassword`, `sessionVersion`, `passwordChangedAt`, `lastLoginAt`, `createdBy`, `deactivatedAt`, `deactivatedBy`, timestamps | `username` unique; `role + status` |
| `sessions` | Server-side sessions (managed by `connect-mongo`; expired sessions are removed automatically) | `expires` (TTL) |
| `audit_events` | `action`, `outcome`, `actor`, `target`, `details`, `ip`, `createdAt`. Append-only; never contains passwords or hashes | `createdAt`; `target.id + createdAt` |
| `system_state` | `{ _id: "staff_bootstrap" }` once the first Super Duper Admin has been created | `_id` |

Staff accounts are **deactivated, never deleted**, so audit history keeps pointing at a real account. Login accounts (`staff_users`) are deliberately separate from future HR employee records.

**Initialization:** when the API starts, `ensureIndexes()` (`server/src/models/index.js`) creates any missing collections and indexes. It never drops or changes existing data. There are no other migration steps.

> The database also has empty `employees` and `sessions` collections left over from an earlier, reverted login attempt. `sessions` is reused. `employees` is unused and empty. It can be dropped in Atlas when convenient, but nothing depends on that.

## 5. One-time setup: the first Super Duper Admin

There is **no web page or API endpoint** that creates the first admin. It's done once, from a terminal, by someone with access to `server/.env`.

1. Make sure `server/.env` has `MONGODB_URI`, `MONGODB_DB_NAME` and `SESSION_SECRET` for the database you're setting up.
2. Open **PowerShell** (or the VS Code terminal) in the `server` folder and run:
   ```
   npm run bootstrap:super-duper-admin
   ```
3. Type the initial password when asked, then type it again. Nothing is shown as you type. The password is never accepted as a command-line argument or environment variable, so it doesn't end up in shell history.
4. The account `bologacbogac` is created with the Super Duper Admin role and must change its password at first sign-in.

The command runs in a single MongoDB transaction and writes a marker. If it's run again, or if any Super Duper Admin already exists, it refuses. Two simultaneous runs can't both succeed. In Git Bash, run it in PowerShell instead, because Git Bash's terminal can't hide typed input for Node.

Options: `--username <name>` (default `bologacbogac`) and `--display-name "<name>"` (default `Super Duper Admin`).

### First sign-in

1. Open the staff app and sign in with `bologacbogac` and the initial password.
2. You're taken to **Choose a new password**. Enter the initial password, then a new one: at least 12 characters, not containing the username, and not a common password.
3. Your other sessions end. This browser gets a fresh session and the dashboard opens.

## 6. Creating more staff accounts

Super Duper Admins and Super Admins can do this in the staff app: **Staff accounts → Create a staff account**.

1. Enter a username, the person's full name and a role. The role list only shows roles you're allowed to assign.
2. The server generates a random **temporary password** (16 characters) and shows it **once**.
3. Give it to the person privately. They must replace it the first time they sign in.

**Forgotten password (recovery procedure):** a Super Admin or Super Duper Admin opens Staff accounts, chooses **Reset password** for the person, and gives them the new temporary password privately. If the only Super Duper Admin loses their password, another Super Duper Admin must reset it. If there's no other, it needs direct database work by a developer. Email-based recovery is **not built**, because no verified email channel exists yet.

## 7. Environment variables (`server/.env`)

| Name | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string (Atlas) |
| `MONGODB_DB_NAME` | Recommended | Database name |
| `SESSION_SECRET` | Yes | Signs session cookies. Random, 32+ characters, different per environment. Changing it signs everyone out |
| `NODE_ENV` | Production | `production` makes cookies HTTPS-only |
| `TRUST_PROXY` | Behind a proxy | Express "trust proxy" (defaults to `1` in production) so HTTPS and client IPs are detected |
| `STAFF_APP_ORIGINS` | Only if cross-origin | Origins allowed to call the staff API directly with cookies. Leave empty when the staff app proxies `/api` (recommended) |
| `CORS_ORIGIN` | Optional | Origins allowed to call the public routes (no credentials) |
| `PORT` | Optional | API port (default 4000) |

The staff app has no environment variables and contains no secrets. `API_PROXY_TARGET` (dev only) changes which API the dev server forwards `/api` to.

## 8. Running and testing

```bash
# API
cd server && npm install && npm run dev        # http://localhost:4000
cd server && npm test                           # 58 automated tests, using an in-memory MongoDB (never touches Atlas)

# Staff app
cd staff && npm install && npm run dev          # http://localhost:5174
cd staff && npm run lint && npm run build       # dist/ for deployment

# Public website (unchanged)
cd landingpage && npm run dev                   # http://localhost:5173
```

## 9. Deployment (not done yet: owner decisions needed)

- **The Express API is not hosted anywhere yet.** Netlify only hosts the public website. Before staff can sign in online, the API needs a Node.js host (for example Render, Railway, Fly.io or a small VPS). This may have a monthly cost and needs owner approval.
- **Recommended setup:** host the staff app (static files from `staff/dist`) on its own Netlify site, and add a Netlify proxy rule so `/api/*` on the staff domain forwards to the API host. The cookie then stays first-party and `STAFF_APP_ORIGINS` can stay empty. The staff site also needs a single-page-app fallback rule (`/* → /index.html`).
- **On the API host:** set `NODE_ENV=production`, a new `SESSION_SECRET`, `MONGODB_URI` and `MONGODB_DB_NAME`, then run the bootstrap command once against the production database.
- In Atlas, restrict **Network Access** to the API host's IP addresses where possible.
- The intended staff subdomain (`pogiako`) and the production domain are not configured. Don't assume either is live.

## 10. Known limitations and future decisions

- Super Admin restrictions: **owner decision pending** (see section 3).
- No multi-factor authentication yet. Recommended before real customer or financial data is stored.
- No self-service password recovery (see section 6).
- Rate-limit counters are per server instance and reset on restart.
- The audit log page shows the latest 100 events. There's no search or export yet.
- CRM, bookings, HR, accounting, reports and settings modules are not built. Their permissions exist but protect nothing yet.
- The database name in use is `makoyrobles_db_user` (from `MONGODB_DB_NAME`). Consider a clearer name before production data exists.
