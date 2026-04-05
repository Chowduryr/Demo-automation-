/**
 * fixtures/index.js
 * Custom Playwright fixtures for the TodoMVC suite.
 * Extend base `test` with pre-configured page objects and state.
 */
const { test: base } = require('@playwright/test');
const { TodoPage }   = require('../pages/TodoPage');
const { TODOS }      = require('../test-data/todos');

/**
 * Fixture: todoPage
 * Provides a fresh TodoPage instance navigated to the app.
 *
 * Fixture: todoPageWithItems
 * Provides a TodoPage pre-populated with default todo items.
 */
const test = base.extend({
  // Plain TodoPage — just navigated, empty state
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },

  // TodoPage pre-filled with sample items (useful for filter/bulk tests)
  todoPageWithItems: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addMultipleTodos(TODOS.defaultItems);
    await use(todoPage);
  },
});

const { expect } = base;

module.exports = { test, expect };
