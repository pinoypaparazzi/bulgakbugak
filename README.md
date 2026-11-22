# AT YOUR SERVICE

| Folder | What it is | Run it |
| --- | --- | --- |
| `landingpage/` | Public website (React + Vite, pre-rendered, deployed on Netlify) | `cd landingpage && npm run dev` → http://localhost:5173 |
| `server/` | Backend API (Express + MongoDB) | `cd server && npm run dev` → http://localhost:4000 |
| `staff/` | Staff app for employees (`pogiako` subdomain), not built yet | |
| `docs/` | Architecture and backend plans | |

Each app has its own `package.json`, so run `npm install` inside a folder the first time you use it.
See `landingpage/README.md` and `server/README.md` for details.
