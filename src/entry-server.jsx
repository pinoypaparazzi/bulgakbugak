/* Used only at build time by scripts/prerender.js to turn the React page
   into plain HTML, so search engines and slow phones see content immediately. */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
