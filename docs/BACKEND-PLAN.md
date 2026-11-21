# Database & Admin Panel — Recommended plan (for tomorrow)

_Prepared 2026-11-22. Nothing in this document has been set up yet._

## Goals

1. Edit services, prices, FAQs, coverage, homepage text, settings and blog posts **without touching code**.
2. Publish blog posts from an Admin Panel and have them appear on the public site.
3. Store booking requests properly and notify the business.
4. Keep the site fast, SEO-friendly, affordable and secure.

## Recommendation: Supabase + Netlify (build hook) + Netlify Functions

| Need | Recommended tool | Why |
| --- | --- | --- |
| Database | **Supabase** (managed PostgreSQL) | Real relational database, free tier to start, works from any host, standard SQL, so not locked in |
| Admin login | **Supabase Auth** (email + password, or magic link) | Built in; no custom password handling |
| Server-side authorization | **PostgreSQL Row Level Security (RLS)** + an `admin_users` table; sensitive actions in **Netlify Functions** using a secret key stored only in Netlify's environment settings | Permissions are enforced by the database and server, not by hiding buttons in the browser |
| Images / media | **Supabase Storage** (public bucket for published images, private for drafts) | Same account, simple access rules |
| Publishing | Admin clicks **Publish** → a Netlify Function calls a **Netlify build hook** → the site rebuilds and redeploys | Keeps the fast, pre-built, SEO-friendly pages we have now |
| Booking requests | Form → **Netlify Function** → validates → saves to `inquiries` table → sends an email notification (e.g. via an email API such as Resend) | Real submissions, stored and confirmed honestly |
| Admin Panel UI | A protected `/admin/` area in this same React project (not pre-rendered, `noindex`) | One codebase, same design system |

### Publishing speed (be honest about this)

Publishing is **not instant**. After you press Publish, Netlify rebuilds the site. For a site this size that usually takes a minute or two (it depends on Netlify's queue). The Admin Panel should show "Publishing… live in a few minutes". If instant updates are needed later for specific content (for example prices), those parts could be loaded live from the database, but that's a trade-off against speed and SEO.

### How the build will read the database

`scripts/prerender.js` and `src/routes.js` will load content from Supabase **at build time** (using a read-only key from Netlify environment variables) instead of from `src/content/*.js`. The data is then embedded in the generated pages. No secret keys are ever sent to visitors' browsers.

## Proposed tables

| Table | Replaces | Key columns |
| --- | --- | --- |
| `settings` | `site.js` (business info, nav, homepage, about, footer, map) | `key`, `value jsonb`, `updated_at` |
| `services` | `SERVICES` + `SPECIALTIES` | `id`, `slug` (unique), `parent_id`, `name`, `summary`, `intro`, `offerings jsonb`, `notes jsonb`, `delivery`, `group`, `icon`, `order`, `status`, `featured_on_home`, `form_fields jsonb`, `seo_title`, `seo_description` |
| `service_pricing` | `pricing` objects | `service_id`, `format`, `amount`, `min`, `max`, `packages jsonb`, `inclusions jsonb`, `exclusions jsonb`, `notes jsonb`, `third_party_note`, `published` |
| `coverage_areas` | `COVERAGE.areas` | `id`, `name`, `order`, `active` |
| `faqs` | `FAQS` | `id`, `question`, `answer`, `order`, `published` |
| `blog_categories` | `BLOG_CATEGORIES` | `id`, `slug` (unique), `name`, `description`, `order` |
| `blog_posts` | `POSTS` | `id`, `slug` (unique), `title`, `excerpt`, `content` (Markdown), `cover_image_path`, `cover_image_alt`, `author`, `category_id`, `tags text[]`, `seo_title`, `seo_description`, `status` (draft / scheduled / published / archived), `created_at`, `modified_at`, `published_at`, `scheduled_at` |
| `redirects` | `previousSlugs` | `from_path` (unique), `to_path`, `created_at` (auto-added when a published slug changes) |
| `testimonials` | `testimonials.js` | `id`, `name`, `context`, `quote`, `permission_confirmed`, `status` |
| `media` | — | `id`, `path`, `alt`, `width`, `height`, `uploaded_by`, `created_at` |
| `inquiries` | the email/SMS fallback | `id`, contact fields, `service_slug`, `details jsonb`, `consent_at`, `status`, `created_at` |
| `admin_users` | — | `user_id`, `role` (owner / editor) |

## Security checklist

- RLS **on** for every table. The public can read only published rows; only `admin_users` can write.
- The Supabase **service-role key** lives only in Netlify environment variables, used by Netlify Functions, and is never placed in frontend code.
- Validate every Admin Panel input on the server (lengths, slugs, allowed formats).
- **Sanitize article HTML** on the server before saving or rendering (for example with DOMPurify), even though only admins write articles.
- Rate-limit the public inquiry function and add spam protection (honeypot field and/or a CAPTCHA).
- Store only the personal data needed; add a privacy notice before collecting inquiries in a database (the Philippine Data Privacy Act applies).

## Backup and recovery

- Supabase Pro includes daily backups. On the free tier, schedule a regular `pg_dump` export (for example a weekly GitHub Action) to private storage.
- Content history: keep `modified_at` and consider a `blog_post_revisions` table for undo.
- Code is already versioned in GitHub; Netlify keeps previous deploys for one-click rollback.

## Expected costs and external dependencies (verify current prices before signing up)

Prices and limits change often. Check each provider's official pricing page before committing.

| Service | Starting point | Notes |
| --- | --- | --- |
| Netlify | Free tier | Usage limits apply to builds, bandwidth and functions; frequent publishing uses build time |
| Supabase | Free tier | Free projects can be **paused after a period of inactivity** and have smaller limits and no automatic backups. The paid Pro plan (roughly US$25/month at the time of writing) removes pausing and adds backups |
| Transactional email (e.g. Resend) | Free tier for low volume | For inquiry notifications |
| Business email hosting for hello@atyourservice.com | Usually paid per user per month | Needed if not already set up |
| Domain renewal (atyourservice.com) | Yearly | Ownership still to be confirmed |

## Alternatives considered

| Option | Pros | Cons |
| --- | --- | --- |
| **Git-based CMS (Decap CMS)** | Free; content stays in GitHub; simple | Not a real database; no inquiry storage; awkward for pricing/availability management; login setup is fiddly |
| **Hosted headless CMS (Sanity, Contentful)** | Excellent editors, image handling | Monthly costs as you grow; vendor lock-in; inquiries still need a separate solution |
| **Netlify Forms** (for inquiries only) | Easiest real form submission, no code backend | Submission limits on the free tier; not a database for the rest of the content |
| **Custom server (Node + database on a VPS)** | Full control | More maintenance, security and server costs; overkill now |

## Suggested order of work

1. Create the Supabase project and tables; enable RLS; add yourself as owner.
2. Write a one-time import script that copies `src/content/*.js` into the tables.
3. Switch the build to read from Supabase; confirm the site is unchanged.
4. Add the `/admin/` login and the blog editor (draft → preview → publish → build hook).
5. Add service/pricing/FAQ/settings editors.
6. Replace the booking form's email/SMS fallback with real submission + notification (keep phone/Viber shown as alternatives).
