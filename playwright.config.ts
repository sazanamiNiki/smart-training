import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  timeout: 120000,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: !process.env.BASE_URL
    ? [
        {
          command: 'npm run dev',
          url: 'http://localhost:5173',
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
        },
        {
          command: 'npx wrangler dev --port 8787 --var MOCK_AI:true',
          cwd: './cloudflare',
          url: 'http://localhost:8787/health',
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
        },
      ]
    : undefined,
});
