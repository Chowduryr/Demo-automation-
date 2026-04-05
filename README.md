# TodoMVC - Playwright Automation Suite

Automated test suite for [TodoMVC](https://demo.playwright.dev/todomvc) using **Playwright + JavaScript**, structured with the **Page Object Model (POM)**.

## 🗂️ Project Structure

```
playwright-todomvc/
├── tests/
│   ├── ui/             # Functional UI test specs
│   └── api/            # API test specs
├── pages/              # Page Object Model classes
├── fixtures/           # Custom Playwright fixtures
├── utils/              # Helper utilities
├── test-data/          # Test data / constants
├── reports/            # Generated test reports
├── playwright.config.js
├── package.json
└── TEST-PLAN.md
```

## ⚙️ Setup

```bash
npm install
npx playwright install
```

## ▶️ Running Tests

```bash
# Run all tests
npx playwright test

# Run UI tests only
npx playwright test tests/ui/

# Run API tests only
npx playwright test tests/api/

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on mobile viewport
npx playwright test --project=mobile-chrome

# Run with UI (headed mode)
npx playwright test --headed

# View HTML report
npx playwright show-report
```

## 📋 Test Coverage

- ✅ Functional UI Tests (TodoMVC flows)
- ✅ API Tests (REST endpoints)
- ✅ Cross-browser: Chrome, Firefox, WebKit (Safari)
- ✅ Mobile / Responsive viewports

## 🔗 App Under Test

- **URL:** https://demo.playwright.dev/todomvc
- **Type:** Web Application (Single Page App - React)
