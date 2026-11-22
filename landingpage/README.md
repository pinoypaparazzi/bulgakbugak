# AT YOUR SERVICE — website

Website for AT YOUR SERVICE (Quezon City pilot program). React + Vite, pre-rendered to static HTML, deployed on Netlify.

## Commands

```bash
npm install          # first time only
npm run dev          # live-editing preview at http://localhost:5173
npm run build        # production build into dist/ (this is what Netlify runs)
npm run preview      # view the build at http://localhost:4173

npm run dev:drafts   # local only: also show DRAFT blog posts
npm run build:drafts # local only: build including drafts. NEVER deploy this
```

## Where to change things (no database yet)

| What | File |
| --- | --- |
| Phone, email, Facebook, domain, nav, homepage text, About, coverage streets | `src/content/site.js` |
| Services, specialty services, pricing format, booking-form extra questions | `src/content/services.js` |
| How it works, pricing principles, "What you can expect", FAQ | `src/content/content.js` |
| Blog posts and categories | `src/content/blog.js` |
| Testimonials (genuine, with permission only) | `src/content/testimonials.js` |
| Colors, fonts, spacing | `src/index.css` |

Rebuilding (`npm run build`, or pushing to GitHub so Netlify rebuilds) updates every page, the sitemap and the SEO tags automatically.

### Adding a blog post (until the Admin Panel exists)

Add an entry to `POSTS` in `src/content/blog.js` with `status: 'published'` and a `publishedAt` date. Put the cover image in `public/images/blog/`. Write the content in Markdown.

### Publishing a price

In `src/content/services.js`, change a service's `pricing`, for example `{ format: 'starting', amount: 500, published: true }`. Supported formats are listed in `src/lib/pricing.js`. Without `published: true`, the site keeps showing "Request a Quote".

## More documentation

- `docs/ARCHITECTURE.md`: how the site is put together today
- `docs/BACKEND-PLAN.md`: recommended database, Admin Panel and publishing plan
