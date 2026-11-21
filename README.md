# AT YOUR SERVICE — website

Landing page for AT YOUR SERVICE (Quezon City pilot program). Built with React + Vite and deployed on Netlify.

## Run it on your computer

```bash
npm install        # first time only
npm run dev        # live-editing preview at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # view the production build at http://localhost:4173
```

## Where to change things

| What | File |
| --- | --- |
| Phone, email, Facebook, domain, page title & description, coverage streets | `src/data/site.js` |
| The 20 services (names, descriptions, icons, filter groups) | `src/data/services.js` |
| How it works, pricing wording, "What you can expect", FAQ | `src/data/content.js` |
| Colors, fonts, spacing | `src/index.css` (top of file) |
| Each page section | `src/components/*.jsx` |
| Logo files | `public/images/` (original: `src/At Your Service Bell Logo.png`) |

SEO tags, Google structured data, `robots.txt` and `sitemap.xml` are generated automatically from the data files when you run `npm run build`.

## Booking form

There is no backend yet. The form checks the details and then prepares a message the customer sends to us by email, SMS or Viber. To connect a real form service later, see the note at the top of `src/lib/inquiry.js`.
