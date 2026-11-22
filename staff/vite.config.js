import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 5173 is the landing page, 4000 is the Express API.
    port: 5174,
    strictPort: true,
    // Forward /api calls to the Express backend in ../server, so the staff
    // app and API share one origin and the session cookie stays first-party.
    // changeOrigin: false keeps the browser's Host header, which the API's
    // CSRF check compares with the Origin header.
    // API_PROXY_TARGET lets tests point at a different API instance.
    proxy: {
      '/api': { target: process.env.API_PROXY_TARGET || 'http://localhost:4000', changeOrigin: false },
    },
  },
})
