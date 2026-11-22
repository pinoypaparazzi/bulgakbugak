/* Blog helpers: decides which articles are public. Pages never read
   POSTS directly. They use these functions, so the publishing rules
   live in exactly one place (and can later move to the database query). */
import { POSTS, BLOG_CATEGORIES } from '../content/blog.js';

export const BLOG_PAGE_SIZE = 9;

/* Draft preview is ONLY enabled by `npm run build:preview` / `npm run dev:preview`
   (VITE_SHOW_DRAFTS=true). Production builds never include drafts. */
const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};
export const SHOW_DRAFTS = env.VITE_SHOW_DRAFTS === 'true';

/* The date the site was built (set in vite.config.js). Scheduled posts go live on the
   first build on/after their publication date, so a rebuild is needed to publish them. */
// eslint-disable-next-line no-undef
const TODAY = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : new Date().toISOString().slice(0, 10);

export const isPublic = (p) => p.status === 'published' && !!p.publishedAt && p.publishedAt <= TODAY;

const sortDate = (p) => p.publishedAt || p.modifiedAt || p.createdAt || '';
const newestFirst = (a, b) => (sortDate(a) < sortDate(b) ? 1 : -1);

/* Articles that get pages in this build. */
export function visiblePosts() {
  return POSTS.filter((p) => isPublic(p) || (SHOW_DRAFTS && p.status === 'draft')).sort(newestFirst);
}
export const publicPosts = () => POSTS.filter(isPublic).sort(newestFirst);
export const findPost = (slug) => visiblePosts().find((p) => p.slug === slug);
export const postUrl = (p) => `/blog/${p.slug}/`;
export const categoryById = (id) => BLOG_CATEGORIES.find((c) => c.id === id);
export const categoryUrl = (c) => `/blog/category/${c.slug}/`;
export const blogPageUrl = (n) => (n <= 1 ? '/blog/' : `/blog/page/${n}/`);

/* Categories that currently have visible articles (only these get pages). */
export const activeCategories = () => BLOG_CATEGORIES.filter((c) => visiblePosts().some((p) => p.categoryId === c.id));

export function relatedPosts(post, limit = 3) {
  const others = visiblePosts().filter((p) => p.id !== post.id);
  const same = others.filter((p) => p.categoryId === post.categoryId);
  return [...same, ...others.filter((p) => p.categoryId !== post.categoryId)].slice(0, limit);
}

/* Dates are formatted in Philippine time so the server and browser always agree. */
export function formatDate(iso) {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00+08:00`).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' });
}
