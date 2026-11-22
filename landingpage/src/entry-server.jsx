/* Used only at build time by scripts/prerender.js to turn each page into
   plain HTML, so search engines and slow phones see content immediately. */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export { getRoutes, getRedirects } from './routes.js';
export { renderHead } from './lib/head.js';
export { SITE } from './content/site.js';

export function render(path) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>
  );
}
