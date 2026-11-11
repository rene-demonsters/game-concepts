import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative asset paths: the same build runs from file:// in Capacitor and, later, Electron.
  base: './',
  server: { host: true, port: 5173 },
  build: { target: 'es2022', chunkSizeWarningLimit: 2000 },
  test: { include: ['test/**/*.test.ts'] },
});
