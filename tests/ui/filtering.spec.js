/**
 * tests/ui/filtering.spec.js
 * TC-013 → TC-017: Filter functionality
 *
 * Covers: All / Active / Completed filters, URL hash, persistence
 */
const { test, expect } = require('../../fixtures');
const { allure }       = require('allure-playwright');
const { TODOS }        = require('../../test-data/todos');

test.describe('Todo Filtering', () => {

  test.beforeEach(async ({ todoPageWithItems }) => {
    // Complete the first item so we have a mix of active + completed
    await todoPageWithItems.completeTodo(TODOS.defaultItems[0]);
  });

  // ─── TC-013: Filter All ─────────────────────────────────────────
  test('TC-013 | "All" filter should show all todo items', async ({ todoPageWithItems }) => {
    await allure.description('Verify the "All" filter displays every todo regardless of status.');
    await allure.severity('critical');
    await allure.label('feature', 'Filtering');
    await allure.label('story', 'Filter All');

    await allure.step('Click the "All" filter', async () => {
      await todoPageWithItems.clickFilterAll();
    });

    await allure.step(`Verify all ${TODOS.defaultItems.length} todos are shown`, async () => {
      await expect(todoPageWithItems.todoItems).toHaveCount(TODOS.defaultItems.length);
    });
  });

  // ─── TC-014: Filter Active ──────────────────────────────────────
  test('TC-014 | "Active" filter should show only incomplete items', async ({ todoPageWithItems }) => {
    await allure.description('Verify the "Active" filter hides completed todos.');
    await allure.severity('critical');
    await allure.label('feature', 'Filtering');
    await allure.label('story', 'Filter Active');

    await allure.step('Click the "Active" filter', async () => {
      await todoPageWithItems.clickFilterActive();
    });

    await allure.step('Verify completed todo is hidden', async () => {
      await expect(todoPageWithItems.getTodoByText(TODOS.defaultItems[0])).toHaveCount(0);
    });

    await allure.step('Verify correct count of active items', async () => {
      const expectedCount = TODOS.defaultItems.length - 1;
      await expect(todoPageWithItems.todoItems).toHaveCount(expectedCount);
    });
  });

  // ─── TC-015: Filter Completed ───────────────────────────────────
  test('TC-015 | "Completed" filter should show only completed items', async ({ todoPageWithItems }) => {
    await allure.description('Verify the "Completed" filter shows only completed todos.');
    await allure.severity('critical');
    await allure.label('feature', 'Filtering');
    await allure.label('story', 'Filter Completed');

    await allure.step('Click the "Completed" filter', async () => {
      await todoPageWithItems.clickFilterCompleted();
    });

    await allure.step('Verify only 1 completed todo is shown', async () => {
      await expect(todoPageWithItems.todoItems).toHaveCount(1);
      await expect(todoPageWithItems.getTodoByText(TODOS.defaultItems[0])).toBeVisible();
    });
  });

  // ─── TC-017: URL hash changes on filter click ───────────────────
  test('TC-017 | URL hash should update when filters are clicked', async ({ todoPageWithItems, page }) => {
    await allure.description('Verify the URL hash updates to #/active, #/completed, and #/ on filter clicks.');
    await allure.severity('minor');
    await allure.label('feature', 'Filtering');
    await allure.label('story', 'URL Routing');

    await allure.step('Click Active → URL should contain #/active', async () => {
      await todoPageWithItems.clickFilterActive();
      expect(page.url()).toContain('#/active');
    });

    await allure.step('Click Completed → URL should contain #/completed', async () => {
      await todoPageWithItems.clickFilterCompleted();
      expect(page.url()).toContain('#/completed');
    });

    await allure.step('Click All → URL should contain #/', async () => {
      await todoPageWithItems.clickFilterAll();
      expect(page.url()).toContain('#/');
    });
  });
});
