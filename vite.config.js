import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Fail loudly instead of silently sliding to 5174 when a dev server is
    // already running — a second copy on another port just breaks the API call,
    // since the server only allows CLIENT_ORIGIN.
    strictPort: true,
    open: true,
  },
});
