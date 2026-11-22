# Staff portal

Internal app for AT YOUR SERVICE staff: sign-in, first-login password change, a role-aware
dashboard, staff account management and the audit log. React 19 + Vite + React Router.

It talks to the Express API in `../server` through `/api` on the same origin. The session is an
httpOnly cookie, and the app stores no tokens or passwords. **The app only decides what to show;
the API enforces every permission.** See [`../docs/AUTH.md`](../docs/AUTH.md).

## Commands

```bash
npm install       # first time only
npm run dev       # http://localhost:5174 (forwards /api to http://localhost:4000)
npm run build     # production build into dist/
npm run preview   # view the build
npm run lint      # check the code with Oxlint
```

Start the API too (`cd ../server && npm run dev`). Without it, sign-in can't work.

## Pages
| Path | Who | What |
| --- | --- | --- |
| `/login` | Everyone | Sign in |
| `/change-password` | Signed in | Required after first sign-in or a reset; also from the account menu |
| `/` | Signed in | Dashboard showing the areas your role covers (unbuilt modules are labelled "Not built yet") |
| `/accounts` | `staff.accounts.read` | Create accounts, change roles, deactivate, reset passwords |
| `/audit` | `audit.read` | Latest 100 security events |

## Design
`src/index.css` is a copy of `../landingpage/src/index.css` (brand colors, fonts, buttons, form
fields). Staff-only styles are in `src/staff.css`. The logo images in `public/images/` are the
website's optimized copies of `At Your Service Bell Logo.png`.

## Deployment
Not deployed yet. The API needs a Node.js host first. See docs/AUTH.md §9.
