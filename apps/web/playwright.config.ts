import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../../e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'phone-390', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'phone-360', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: { command: 'pnpm dev', url: 'http://localhost:3000', reuseExistingServer: true },
});
