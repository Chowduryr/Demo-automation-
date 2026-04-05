// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration
 * App Under Test : https://demo.playwright.dev/todomvc
 * Reporting      : Allure + Playwright HTML
 * Coverage       : Cross-browser, Mobile viewports, UI + API
 */
module.exports = defineConfig({
  // ─── Test Discovery ───────────────────────────────────────────────
  testDir:   './tests',
  testMatch: '**/*.spec.js',

  // ─── Global Settings ──────────────────────────────────────────────
  timeout: 30_000,
  expect:  { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly:    !!process.env.CI,
  retries:       process.env.CI ? 2 : 1,   // 1 local retry, 2 in CI
  workers:       process.env.CI ? 2 : undefined,

  // ─── Reporting ────────────────────────────────────────────────────
  reporter: [
    // Console output
    ['list'],

    // Allure — rich interactive report with history, steps & attachments
    [
      'allure-playwright',
      {
        detail:         true,
        outputFolder:   'allure-results',
        suiteTitle:     true,
        categories: [
          {
            name:           'Ignored tests',
            matchedStatuses: ['skipped'],
          },
          {
            name:                 'Infrastructure problems',
            matchedStatuses:      ['broken'],
            messageRegex:         '.*Error.*',
          },
          {
            name:            'Product defects',
            matchedStatuses: ['failed'],
          },
        ],
      },
    ],

    // Playwright HTML — local trace/screenshot/video viewer
    ['html', { outputFolder: 'playwright-report', open: 'never' }],

    // JSON — machine-readable results (useful for dashboards / slack bots)
    ['json', { outputFile: 'reports/results.json' }],

    // JUnit XML — for GitHub Actions test summary
    ['junit', { outputFile: 'reports/junit-results.xml' }],
  ],

  // ─── Shared Browser Settings ──────────────────────────────────────
  use: {
    baseURL:    'https://demo.playwright.dev/todomvc',
    trace:      'on-first-retry',       // Capture trace on retry
    screenshot: 'only-on-failure',      // Screenshot on failure
    video:      'retain-on-failure',    // Video on failure
    actionTimeout: 10_000,
  },

  // ─── Browser Projects ─────────────────────────────────────────────
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use:  { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use:  { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use:  { ...devices['Desktop Safari'] },
    },

    // Mobile Viewports
    {
      name: 'mobile-chrome',
      use:  { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use:  { ...devices['iPhone 13'] },
    },

    // API Tests (no browser — faster headless execution)
    {
      name:      'api',
      testMatch: '**/api/**/*.spec.js',
      use: {
        baseURL: 'https://reqres.in',
      },
    },
  ],

  // ─── Output ───────────────────────────────────────────────────────
  outputDir: 'test-results/',
});
