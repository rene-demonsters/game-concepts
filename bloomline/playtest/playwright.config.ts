import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'test/e2e',
  timeout: 60_000,
  use: { baseURL: 'http://localhost:5179/' },
  webServer: { command: 'pnpm exec vite --port 5179 --strictPort', url: 'http://localhost:5179/', reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 800 } } },
  ],
});
