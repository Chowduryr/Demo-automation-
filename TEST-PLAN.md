# Test Plan — TodoMVC Playwright Automation Suite

| Field            | Detail                                              |
|------------------|-----------------------------------------------------|
| **Project**      | TodoMVC Automation                                  |
| **Prepared By**  | Romel                                               |
| **Date**         | 2026-04-03                                          |
| **Version**      | 1.0                                                 |
| **App URL**      | https://demo.playwright.dev/todomvc                 |
| **Framework**    | Playwright + JavaScript (Page Object Model)         |
| **Browsers**     | Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari |

---

## 1. Objectives

- Validate all core TodoMVC user flows are functioning correctly
- Ensure cross-browser compatibility across Chromium, Firefox, and WebKit
- Verify responsive behaviour on mobile viewports (Pixel 5, iPhone 13)
- Test REST API contracts where applicable
- Maintain a maintainable, scalable test suite using the Page Object Model pattern

---

## 2. Scope

### 2.1 In Scope

| Area               | Description                                               |
|--------------------|-----------------------------------------------------------|
| Functional UI      | All Todo CRUD operations, filtering, routing              |
| Cross-browser      | Chrome, Firefox, Safari (desktop)                         |
| Mobile/Responsive  | Pixel 5 (Android), iPhone 13 (iOS) viewports              |
| API Testing        | REST API calls — covered via Playwright `request` fixture |
| Regression         | All features re-tested on each change                     |

### 2.2 Out of Scope

- Performance / load testing
- Accessibility (a11y) testing
- Security / penetration testing
- Backend database validation

---

## 3. Test Environments

| Environment | URL                                      | Notes            |
|-------------|------------------------------------------|------------------|
| Demo / UAT  | https://demo.playwright.dev/todomvc      | Primary test env |
| CI          | GitHub Actions (on push / PR)            | Automated runs   |

---

## 4. Test Categories & Test Cases

### 4.1 Functional UI Tests

#### Module: Todo Item Management

| TC ID  | Test Case Description                              | Priority | Status  |
|--------|----------------------------------------------------|----------|---------|
| TC-001 | Add a single new todo item                         | High     | Pending |
| TC-002 | Add multiple todo items in sequence                | High     | Pending |
| TC-003 | Mark a todo item as completed                      | High     | Pending |
| TC-004 | Unmark a completed todo item (toggle back)         | Medium   | Pending |
| TC-005 | Edit an existing todo item inline                  | High     | Pending |
| TC-006 | Delete a todo item using the × button              | High     | Pending |
| TC-007 | Add todo with very long text (boundary test)       | Low      | Pending |
| TC-008 | Attempt to add empty todo (no action expected)     | Medium   | Pending |

#### Module: Bulk Actions

| TC ID  | Test Case Description                              | Priority | Status  |
|--------|----------------------------------------------------|----------|---------|
| TC-009 | Mark all todos as complete using toggle-all        | High     | Pending |
| TC-010 | Unmark all todos using toggle-all (all completed)  | Medium   | Pending |
| TC-011 | Clear all completed todos via "Clear completed"    | High     | Pending |
| TC-012 | Item counter shows correct remaining count         | Medium   | Pending |

#### Module: Filtering

| TC ID  | Test Case Description                              | Priority | Status  |
|--------|----------------------------------------------------|----------|---------|
| TC-013 | Filter by "All" shows all todo items               | High     | Pending |
| TC-014 | Filter by "Active" shows only incomplete items     | High     | Pending |
| TC-015 | Filter by "Completed" shows only completed items   | High     | Pending |
| TC-016 | Active filter persists on page reload              | Medium   | Pending |
| TC-017 | Filter URL hash changes on filter click (#/active) | Low      | Pending |

#### Module: Persistence

| TC ID  | Test Case Description                              | Priority | Status  |
|--------|----------------------------------------------------|----------|---------|
| TC-018 | Todos persist after browser page reload            | High     | Pending |
| TC-019 | Completed state persists after page reload         | Medium   | Pending |

---

### 4.2 API Tests

| TC ID  | Test Case Description                              | Priority | Status  |
|--------|----------------------------------------------------|----------|---------|
| ATC-001| GET /api/users — returns 200 with user list        | High     | Pending |
| ATC-002| POST /api/users — creates user, returns 201        | High     | Pending |
| ATC-003| PUT /api/users/:id — updates user, returns 200     | Medium   | Pending |
| ATC-004| DELETE /api/users/:id — returns 204                | Medium   | Pending |
| ATC-005| GET /api/users?page=2 — validates pagination       | Low      | Pending |
| ATC-006| POST /api/login — valid credentials return token   | High     | Pending |
| ATC-007| POST /api/login — invalid credentials return 400   | High     | Pending |

---

### 4.3 Cross-Browser Tests

All TC-001 through TC-017 are executed across:

| Browser        | Device Profile     |
|----------------|--------------------|
| Chromium       | Desktop Chrome     |
| Firefox        | Desktop Firefox    |
| WebKit         | Desktop Safari     |

---

### 4.4 Mobile / Responsive Tests

| TC ID  | Test Case Description                              | Priority | Device        |
|--------|----------------------------------------------------|----------|---------------|
| MTC-001| App renders correctly on mobile viewport           | High     | Pixel 5       |
| MTC-002| Add todo on mobile keyboard (touch)                | High     | iPhone 13     |
| MTC-003| Toggle and delete work on touch targets            | High     | Both          |
| MTC-004| Filter buttons visible and tappable on mobile      | Medium   | Both          |

---

## 5. Page Object Model Structure

```
pages/
├── BasePage.js          # Shared methods (navigate, waitForLoad, etc.)
└── TodoPage.js          # All TodoMVC selectors and actions

tests/
├── ui/
│   ├── todo-management.spec.js
│   ├── bulk-actions.spec.js
│   ├── filtering.spec.js
│   └── persistence.spec.js
└── api/
    └── users-api.spec.js

fixtures/
└── index.js             # Custom fixtures (e.g., pre-filled todo state)

utils/
└── helpers.js           # Reusable utility functions

test-data/
└── todos.js             # Test data constants
```

---

## 6. Entry & Exit Criteria

### Entry Criteria
- Playwright installed and browsers configured
- App URL is accessible and stable
- Git repo initialized and first commit pushed

### Exit Criteria
- All High-priority test cases pass
- Zero unresolved failures on Chromium
- HTML report generated and reviewed
- All tests committed and pushed to GitHub

---

## 7. Risk & Mitigations

| Risk                              | Impact | Mitigation                          |
|-----------------------------------|--------|-------------------------------------|
| Demo app unavailable              | High   | Add retry logic; use mock if needed |
| Flaky selectors on mobile         | Medium | Use data-testid / ARIA roles        |
| Slow CI pipeline                  | Low    | Parallelise; limit mobile to smoke  |
| localStorage not persisting       | Medium | Explicitly wait for state to flush  |

---

## 8. Deliverables

- [x] `TEST-PLAN.md` — this document
- [x] `playwright.config.js` — multi-browser + mobile config
- [x] `pages/` — Page Object Model classes
- [x] `tests/ui/` — Functional UI spec files
- [x] `tests/api/` — API spec files
- [x] `README.md` — Setup and run instructions
- [ ] GitHub Actions CI workflow (`.github/workflows/playwright.yml`)
- [ ] HTML report artifacts

---

## 9. Schedule

| Milestone                   | Target Date  |
|-----------------------------|--------------|
| Project setup + test plan   | 2026-04-03   |
| POM pages + UI specs        | 2026-04-04   |
| API specs                   | 2026-04-05   |
| Cross-browser + mobile run  | 2026-04-06   |
| CI/CD pipeline              | 2026-04-07   |
| Final review & sign-off     | 2026-04-08   |
