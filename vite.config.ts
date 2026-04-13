import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// NOTE: The Gemini API key is intentionally NOT injected here.
// All AI generation calls route through the Cloud Run backend (/api/v1/generate/batch),
// which securely retrieves the key from GCP Secret Manager at runtime.
// Only the backend endpoint URL is needed by the frontend.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'appscript',
    emptyOutDir: false, // Preserves Code.js and appsscript.json from being deleted
    minify: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
