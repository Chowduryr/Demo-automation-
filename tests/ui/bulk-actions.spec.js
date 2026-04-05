/**
 * tests/ui/bulk-actions.spec.js
 * TC-009 → TC-012: Bulk Actions
 *
 * Covers: Toggle All, Clear Completed, Item Counter
 */
const { test, expect } = require('../../fixtures');
const { allure }       = require('allure-playwright');
const { TODOS }        = require('../../test-data/todos');

test.describe('Bulk Actions', () => {

  // ─── TC-009: Mark all as complete ──────────────────────────────
  test('TC-009 | toggle-all should mark all todos as complete', async ({ todoPageWithItems }) => {
    await allure.description('Verify the toggle-all checkbox marks every todo as completed.');
    await allure.severity('critical');
    await allure.label('feature', 'Bulk Actions');
    await allure.label('story', 'Toggle All');

    await allure.step('Click toggle-all button', async () => {
      await todoPageWithItems.toggleAll();
    });

    await allure.step('Verify all todos are marked complete', async () => {
      for (const item of TODOS.defaultItems) {
        expect(await todoPageWithItems.isTodoCompleted(item)).toBe(true);
      }
    });
  });

  // ─── TC-010: Unmark all (when all completed) ───────────────────
  test('TC-010 | toggle-all should unmark all when all are completed', async ({ todoPageWithItems }) => {
    await allure.description('Verify toggle-all unchecks all todos when they are all already completed.');
    await allure.severity('normal');
    await allure.label('feature', 'Bulk Actions');
    await allure.label('story', 'Toggle All');

    await allure.step('Mark all todos complete', async () => {
      await todoPageWithItems.toggleAll();
    });

    await allure.step('Click toggle-all again to unmark all', async () => {
      await todoPageWithItems.toggleAll();
    });

    await allure.step('Verify all todos are active again', async () => {
      for (const item of TODOS.defaultItems) {
        expect(await todoPageWithItems.isTodoCompleted(item)).toBe(false);
      }
    });
  });

  // ─── TC-011: Clear completed ────────────────────────────────────
  test('TC-011 | "Clear completed" should remove all completed items', async ({ todoPageWithItems }) => {
    await allure.description('Verify "Clear completed" removes only the completed todos from the list.');
    await allure.severity('critical');
    await allure.label('feature', 'Bulk Actions');
    await allure.label('story', 'Clear Completed');

    await allure.step('Complete first two todos', async () => {
      await todoPageWithItems.completeTodo(TODOS.defaultItems[0]);
      await todoPageWithItems.completeTodo(TODOS.defaultItems[1]);
    });

    await allure.step('Click "Clear completed"', async () => {
      await todoPageWithItems.clearCompleted();
    });

    await allure.step('Verify only the active todo remains', async () => {
      await expect(todoPageWithItems.todoItems).toHaveCount(1);
      await expect(todoPageWithItems.getTodoByText(TODOS.defaultItems[2])).toBeVisible();
    });
  });

  // ─── TC-012: Item counter ───────────────────────────────────────
  test('TC-012 | item counter should reflect remaining active todos', async ({ todoPageWithItems }) => {
    await allure.description('Verify the "X items left" counter updates correctly as todos are completed.');
    await allure.severity('normal');
    await allure.label('feature', 'Bulk Actions');
    await allure.label('story', 'Item Counter');

    const total = TODOS.defaultItems.length;

    await allure.step(`Verify counter shows ${total} initially`, async () => {
      await expect(todoPageWithItems.itemCountLabel).toContainText(`${total}`);
    });

    await allure.step('Complete one todo and verify counter decrements', async () => {
      await todoPageWithItems.completeTodo(TODOS.defaultItems[0]);
      await expect(todoPageWithItems.itemCountLabel).toContainText(`${total - 1}`);
    });
  });
});
