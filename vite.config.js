import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { renderHead } from './src/lib/head.js';

const HEAD_MARKER = /<!--head:[^>]*-->/;

/* In development (`npm run dev`) fill in default <head> tags.
   In production builds the marker is left alone; scripts/prerender.js
   then writes the correct tags for each individual page. */
function devHead() {
  return {
    name: 'dev-head',
    transformIndexHtml(html, ctx) {
      return ctx.server ? html.replace(HEAD_MARKER, renderHead({ noindex: true })) : html;
    },
  };
}

export default defineConfig({
  plugins: [react(), devHead()],
  define: {
    // Used to decide which blog posts are published (see src/lib/blog.js).
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
});
