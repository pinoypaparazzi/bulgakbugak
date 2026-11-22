import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

/* Admin site for employees: pogiako.atyourservice.com
   Built separately from the public website so none of its code ships there.
     npm run dev:admin    -> http://localhost:5174
     npm run build:admin  -> dist-admin/ (deploy this folder to the pogiako subdomain) */
const r = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r('./admin'),
  publicDir: r('./public'), // shares the logo and favicons with the main site
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    proxy: { '/api': 'http://localhost:4000' },
  },
  build: {
    outDir: r('./dist-admin'),
    emptyOutDir: true,
  },
});
