# AT YOUR SERVICE

| Folder | What it is | Run it |
| --- | --- | --- |
| `landingpage/` | Public website (React + Vite, pre-rendered, deployed on Netlify) | `cd landingpage && npm run dev` → http://localhost:5173 |
| `server/` | Backend API (Express + MongoDB): inquiries, staff sign-in and permissions | `cd server && npm run dev` → http://localhost:4000 |
| `staff/` | Staff portal (sign-in, roles, staff accounts, audit log). Not deployed yet | `cd staff && npm run dev` → http://localhost:5174 |
| `docs/` | Architecture, backend plans, and [staff sign-in and roles](docs/AUTH.md) | |

Each app has its own `package.json`, so run `npm install` inside a folder the first time you use it.
See each folder's README for details.
