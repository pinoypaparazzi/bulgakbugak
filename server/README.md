# AT YOUR SERVICE API

Express + MongoDB (Mongoose) backend.

## Setup
1. `cd server && npm install`
2. Copy `.env.example` to `.env` and set `MONGODB_URI` (local MongoDB or a MongoDB Atlas connection string).
3. `npm run dev` (restarts on file changes) — API runs on http://localhost:4000

The Vite dev server proxies `/api/*` to this API, so the frontend can call `fetch('/api/...')`.

## Routes
- `GET /api/health` — status and database connection state
- `POST /api/inquiries` — save a booking request (validated with `src/lib/inquiry.js`, same rules as the form)
