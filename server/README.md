# AT YOUR SERVICE API

Express + MongoDB (Mongoose) backend for the public website and the staff site
(`pogiako.atyourservice.com`, source in `../admin`).

## Setup
1. `cd server && npm install`
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `SESSION_SECRET`.
3. `npm run dev` (restarts on file changes). The API runs on http://localhost:4000.

Both Vite dev servers forward `/api/*` to this API:
- public site: `npm run dev` (root folder), http://localhost:5173
- staff site: `npm run dev:admin` (root folder), http://localhost:5174

## Employee accounts
There is no public sign-up. Create accounts from this folder:

```
npm run create-employee -- --email juan@atyourservice.com --name "Juan Dela Cruz" --role admin
npm run create-employee -- --email juan@atyourservice.com --reset-password
```

You'll be asked for the password (at least 10 characters). `--role` is `staff` (default) or `admin`.
To block someone, set `active: false` on their employee record; they're signed out on their next request.

## Routes
- `GET /api/health`: status and database connection state
- `POST /api/inquiries`: save a booking request (validated with `src/lib/inquiry.js`, same rules as the form)
- `POST /api/auth/login` `{ email, password }`: sign in (sets the `ays.sid` session cookie)
- `GET /api/auth/me`: the signed-in employee, or 401
- `POST /api/auth/logout`: sign out

## How sign-in is secured
- Passwords are hashed with scrypt (Node built-in) and never returned by the API.
- Sessions are stored in MongoDB (`sessions` collection). The cookie is httpOnly, SameSite=Lax,
  HTTPS-only when `NODE_ENV=production`, and expires after 8 hours of inactivity.
- Logins are limited to 10 failed attempts per IP + email every 15 minutes.
- Wrong email and wrong password give the same message, so accounts can't be discovered.
