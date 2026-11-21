/* Builds the per-page <head> tags (title, description, canonical, Open Graph,
   structured data). Used by scripts/prerender.js for every page, and by
   vite.config.js in development. */
import { SITE } from '../content/site.js';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const abs = (p) => (p.startsWith('http') ? p : `${SITE.url}${p}`);

export function renderHead({ title, description, path = '/', ogType = 'website', image, imageAlt, noindex = false, jsonLd = [], article } = {}) {
  const t = title || SITE.defaultTitle;
  const d = description || SITE.defaultDescription;
  const url = abs(path);
  const img = abs(image || SITE.ogImage);
  const alt = imageAlt || SITE.ogImageAlt;
  const tags = [
    `<title>${esc(t)}</title>`,
    `<meta name="description" content="${esc(d)}" />`,
    noindex ? '<meta name="robots" content="noindex, follow" />' : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:title" content="${esc(t)}" />`,
    `<meta property="og:description" content="${esc(d)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:image:alt" content="${esc(alt)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ];
  if (!image) tags.push('<meta property="og:image:width" content="1200" />', '<meta property="og:image:height" content="630" />');
  if (article?.publishedTime) tags.push(`<meta property="article:published_time" content="${article.publishedTime}" />`);
  if (article?.modifiedTime) tags.push(`<meta property="article:modified_time" content="${article.modifiedTime}" />`);
  for (const data of jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}
