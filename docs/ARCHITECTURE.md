# AT YOUR SERVICE — Current architecture (static phase)

_Last updated: 2026-11-22_

## In one paragraph

The site is a **React + Vite** app that is turned into **plain HTML files at build time** ("pre-rendering"). Every page (home, services, each service, pricing, blog, articles, about, FAQ, contact, book, 404) becomes its own `index.html` with its own title, description, canonical URL and structured data. Netlify serves those files. There is **no database and no backend**. All content lives in local files in `src/content/`.

## Folder map

| Folder / file | What it is |
| --- | --- |
| `src/content/site.js` | Business details, contact info, navigation, homepage copy, About text, coverage areas, map view |
| `src/content/services.js` | The 20 service categories + 4 specialty services (government compliance, drone, electrician, plumbing), including pricing format and extra booking-form questions |
| `src/content/content.js` | How-it-works steps, pricing principles, "What you can expect", FAQ |
| `src/content/blog.js` | Blog categories and articles (currently one **draft** used to test the template) |
| `src/content/testimonials.js` | Empty. Only genuine testimonials, with permission |
| `src/lib/` | Logic: pricing display (`pricing.js`), blog publishing rules (`blog.js`), `<head>` tags (`head.js`), structured data, Markdown, inquiry message builder |
| `src/routes.js` | The list of every page and its SEO data; also builds redirects |
| `src/pages/` | One component per page type (one reusable template for all service pages, one for all articles) |
| `src/components/` | Reusable building blocks (header, footer, cards, forms, map, etc.) |
| `scripts/prerender.js` | After `vite build`, writes each page's HTML, `404.html`, `sitemap.xml`, `robots.txt` and `_redirects` |

## How a page is built

```
src/content/*.js  ──►  src/routes.js (list of pages + SEO)  ──►  scripts/prerender.js
                                                                   │
                       React page components render HTML  ◄────────┘
                                                                   │
                                              dist/<page>/index.html  (+ sitemap, robots, redirects)
```

In the browser, React then "hydrates" the page so interactive parts work (mobile menu, service filters, booking form).

## Rules built into the code

- **Pricing**: services only show an amount if their `pricing` object has `published: true` *and* a valid amount. Otherwise "Request a Quote" or "Provider quotation" is shown. No prices are currently set.
- **Blog**: an article is public only if `status: 'published'` and `publishedAt` is on or before the build date. Drafts and archived posts never get public pages and are never in the sitemap. Old slugs in `previousSlugs` become 301 redirects.
- **Draft preview**: `npm run build:drafts` or `npm run dev:drafts` includes drafts (marked "Draft preview", `noindex`) for local checking only. Never deploy this mode.
- **Booking form**: validates input, then prepares an email/SMS/Viber message for the customer to send. It does not store or send anything itself.

## Where things go when the database arrives

Each content file maps to a future table (see `docs/BACKEND-PLAN.md`). Pages never read the content files directly for business rules; they use helpers such as `publishedServices()`, `visiblePosts()` and `describePrice()`. Those helpers are the places that will switch to database data, so the page designs shouldn't need rewriting.

## Known trade-offs

- All content is currently bundled into the JavaScript file (about 89 KB gzipped in total). That's fine for 24 services and a few articles. With many articles, the backend phase should load article bodies per page instead.
- Scheduled blog posts go live on the **next build** after their date, not at the exact minute.
