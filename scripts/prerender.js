/* Runs after `vite build` (see "build" in package.json).
   1. Renders the React page to HTML and puts it inside dist/index.html
   2. Writes robots.txt and sitemap.xml using the domain in src/data/site.js
   3. Removes the temporary server bundle */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE } from '../src/data/site.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const indexPath = path.join(dist, 'index.html');
const template = fs.readFileSync(indexPath, 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Placeholder <!--app-html--> missing in index.html');
fs.writeFileSync(indexPath, template.replace('<!--app-html-->', render()));

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`
);
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE.url}/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`
);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log('✓ Pre-rendered dist/index.html, wrote robots.txt and sitemap.xml');
