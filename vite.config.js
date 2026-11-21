import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE } from './src/data/site.js';
import { buildStructuredData } from './src/lib/structuredData.js';

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* Fills the __PLACEHOLDERS__ in index.html from src/data/site.js, so the
   domain, title and description are defined in exactly one place. */
function siteMeta() {
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      const json = JSON.stringify(buildStructuredData()).replace(/</g, '\\u003c');
      return html
        .replaceAll('__SITE_URL__', SITE.url)
        .replaceAll('__SITE_NAME__', escapeAttr(SITE.name))
        .replaceAll('__TITLE__', escapeAttr(SITE.title))
        .replaceAll('__DESCRIPTION__', escapeAttr(SITE.description))
        .replace('__STRUCTURED_DATA__', json);
    },
  };
}

export default defineConfig({
  plugins: [react(), siteMeta()],
});
