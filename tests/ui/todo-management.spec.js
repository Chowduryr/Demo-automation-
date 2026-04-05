/**
 * tests/ui/todo-management.spec.js
 * TC-001 → TC-008: Todo Item Management
 *
 * Covers: Add, Complete, Edit, Delete, edge cases
 */
const { test, expect }  = require('../../fixtures');
const { allure }        = require('allure-playwright');
const { TODOS }         = require('../../test-data/todos');

test.describe('Todo Item Management', () => {

  // ─── TC-001: Add a single new todo ─────────────────────────────
  test('TC-001 | should add a single todo item', async ({ todoPage }) => {
    await allure.description('Verify a user can add a single todo item and it appears in the list.');
    await allure.severity('critical');
    await allure.label('feature', 'Todo Management');
    await allure.label('story', 'Add Todo');

    await allure.step('Add a new todo item', async () => {
      await todoPage.addTodo(TODOS.singleItem);
    });

    await allure.step('Verify todo appears in the list', async () => {
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.todoItems.first()).toContainText(TODOS.singleItem);
    });
  });

  // ─── TC-002: Add multiple todo items ───────────────────────────
  test('TC-002 | should add multiple todo items in sequence', async ({ todoPage }) => {
    await allure.description('Verify multiple todo items can be added one after another.');
    await allure.severity('critical');
    await allure.label('feature', 'Todo Management');
    await allure.label('story', 'Add Todo');

    await allure.step('Add all default todo items', async () => {
      await todoPage.addMultipleTodos(TODOS.defaultItems);
    });

    await allure.step('Verify correct count is shown', async () => {
      await expect(todoPage.todoItems).toHaveCount(TODOS.defaultItems.length);
    });

    await allure.step('Verify each item is visible', async () => {
      for (const item of TODOS.defaultItems) {
        await expect(todoPage.getTodoByText(item)).toBeVisible();
      }
    });
  });

  // ─── TC-003: Mark a todo as completed ──────────────────────────
  test('TC-003 | should mark a todo item as completed', async ({ todoPageWithItems }) => {
    await allure.description('Verify checking a todo marks it with the "completed" class.');
    await allure.severity('critical');
    await allure.label('feature', 'Todo Management');
    await allure.label('story', 'Complete Todo');

    const target = TODOS.defaultItems[0];

    await allure.step(`Complete todo: "${target}"`, async () => {
      await todoPageWithItems.completeTodo(target);
    });

    await allure.step('Verify checkbox is checked', async () => {
      expect(await todoPageWithItems.isTodoCompleted(target)).toBe(true);
    });

    await allure.step('Verify item has "completed" class', async () => {
      await expect(todoPageWithItems.getTodoByText(target)).toHaveClass(/completed/);
    });
  });

  // ─── TC-004: Unmark a completed todo ───────────────────────────
  test('TC-004 | should unmark a completed todo item', async ({ todoPageWithItems }) => {
    await allure.description('Verify a completed todo can be toggled back to active.');
    await allure.severity('normal');
    await allure.label('feature', 'Todo Management');
    await allure.label('story', 'Complete Todo');

    const target = TODOS.defaultItems[0];

    await allure.step('First complete the todo', async () => {
      await todoPageWithItems.completeTodo(target);
      expect(await todoPageWithItems.isTodoCompleted(target)).toBe(true);
    });

    await allure.step('Uncomplete the todo', async () => {
      await todoPageWithItems.uncompleteTodo(target);
    });

    await allure.step('Verify todo is now active again', async () => {
      expect(await todoPageWithItems.isTodoCompleted(target)).toBe(false);
    });
  });

  // ─── TC-005: Edit a todo item inline ───────────────────────────
  test('TC-005 | should edit a todo item inline', async ({ todoPageWithItems }) => {
    await allure.description('Verify double-clicking a todo allows inline editing.');
    await allure.severity('critical');
    await allure.label('feature', 'Todo Management');
    await allure.label('story', 'Edit Todo');

    const original = TODOS.defaultItems[1];
    const updated  = TODOS.editedItem;

    await allure.step(`Double-click and edit: "${original}" → "${updated}"`, async () => {
      await todoPageWithItems.editTodo(original, updated);
    });

    await allure.step('Verify updated text is visible', async () => {
      await expect(todoPageWithItems.getTodoByText(updated)).toBeVisible();
    });

    await allure.step('Verify old text is gone', async () => {
      await expect(todoPageWithItems.getTodoByText(original)).toHaveCount(0);
    });
  });

  // ─── TC-006: Delete a todo item ────────────────────────────────
  test('TC-006 | should delete a todo item', async ({ todoPageWithItems }) => {
    await allure.description('Verify hovering and clicking × removes the todo from the list.');
    await allure.severity('critical');
    await allure.label('feature', 'Todo Management');
    await allure.label('story', 'Delete Todo');

    const target      = TODOS.defaultItems[2];
    const countBefore = await todoPageWithItems.getTodoCount();

    await allure.step(`Delete todo: "${target}"`, async () => {
      await todoPageWithItems.deleteTodo(target);
    });

    await allure.step('Verify todo no longer exists', async () => {
      await expect(todoPageWithItems.getTodoByText(target)).toHaveCount(0);
    });

    await allure.step('Verify total count decreased by 1', async () => {
      await expect(todoPageWithItems.todoItems).toHaveCount(countBefore - 1);
    });
  });

  // ─── TC-007: Long text boundary test ───────────────────────────
  test('TC-007 | should add a todo with very long text', async ({ todoPage }) => {
    await allure.description('Boundary test: add a todo with 200-character text.');
    await allure.severity('minor');
    await allure.label('feature', 'Todo Management');
    await allure.label('story', 'Add Todo');

    await allure.step('Add a 200-char todo', async () => {
      await todoPage.addTodo(TODOS.longText);
    });

    await allure.step('Verify it is added and visible', async () => {
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.todoItems.first()).toContainText(TODOS.longText.slice(0, 50));
    });
  });

  // ─── TC-008: Empty todo should not be added ────────────────────
  test('TC-008 | should not add an empty todo item', async ({ todoPage }) => {
    await allure.description('Verify pressing Enter with an empty input does not create a todo.');
    await allure.severity('normal');
    await allure.label('feature', 'Todo Management');
    await allure.label('story', 'Add Todo');

    await allure.step('Submit empty input', async () => {
      await todoPage.addTodo(TODOS.emptyText);
    });

    await allure.step('Verify no todo was added', async () => {
      await expect(todoPage.todoItems).toHaveCount(0);
    });
  });
});
