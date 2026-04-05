/**
 * TodoPage.js
 * Page Object for the TodoMVC application.
 * URL: https://demo.playwright.dev/todomvc
 *
 * Encapsulates all selectors and user actions for the Todo page.
 */
const { BasePage } = require('./BasePage');

class TodoPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ─── Locators ───────────────────────────────────────────────────
    this.newTodoInput    = page.getByPlaceholder('What needs to be done?');
    this.todoItems       = page.getByTestId('todo-item');
    this.toggleAllBtn    = page.getByLabel('Mark all as complete');
    this.clearCompletedBtn = page.getByRole('button', { name: 'Clear completed' });
    this.itemCountLabel  = page.getByTestId('todo-count');

    // Filter links
    this.filterAll       = page.getByRole('link', { name: 'All' });
    this.filterActive    = page.getByRole('link', { name: 'Active' });
    this.filterCompleted = page.getByRole('link', { name: 'Completed' });
  }

  // ─── Navigation ──────────────────────────────────────────────────

  async goto() {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  // ─── Actions ─────────────────────────────────────────────────────

  /**
   * Add a new todo item
   * @param {string} text
   */
  async addTodo(text) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  /**
   * Add multiple todo items
   * @param {string[]} items
   */
  async addMultipleTodos(items) {
    for (const item of items) {
      await this.addTodo(item);
    }
  }

  /**
   * Get a todo item locator by its text
   * @param {string} text
   */
  getTodoByText(text) {
    return this.todoItems.filter({ hasText: text });
  }

  /**
   * Check (complete) a specific todo item
   * @param {string} text
   */
  async completeTodo(text) {
    const todo = this.getTodoByText(text);
    await todo.getByRole('checkbox').check();
  }

  /**
   * Uncheck (re-activate) a specific todo item
   * @param {string} text
   */
  async uncompleteTodo(text) {
    const todo = this.getTodoByText(text);
    await todo.getByRole('checkbox').uncheck();
  }

  /**
   * Delete a specific todo item by hovering and clicking ×
   * @param {string} text
   */
  async deleteTodo(text) {
    const todo = this.getTodoByText(text);
    await todo.hover();
    await todo.getByRole('button', { name: 'Delete' }).click();
  }

  /**
   * Edit a todo item inline (double-click → type → Enter)
   * @param {string} originalText
   * @param {string} newText
   */
  async editTodo(originalText, newText) {
    const todo = this.getTodoByText(originalText);
    await todo.dblclick();
    const editInput = todo.getByRole('textbox', { name: 'Edit' });
    await editInput.clear();
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  /**
   * Toggle all todos (mark all complete or incomplete)
   */
  async toggleAll() {
    await this.toggleAllBtn.click();
  }

  /**
   * Click "Clear completed" button
   */
  async clearCompleted() {
    await this.clearCompletedBtn.click();
  }

  // ─── Filters ─────────────────────────────────────────────────────

  async clickFilterAll()       { await this.filterAll.click(); }
  async clickFilterActive()    { await this.filterActive.click(); }
  async clickFilterCompleted() { await this.filterCompleted.click(); }

  // ─── Getters ─────────────────────────────────────────────────────

  /**
   * Get count of visible todo items
   * @returns {Promise<number>}
   */
  async getTodoCount() {
    return this.todoItems.count();
  }

  /**
   * Get the "X items left" counter text
   * @returns {Promise<string>}
   */
  async getItemCountText() {
    return this.itemCountLabel.innerText();
  }

  /**
   * Check if a specific todo is marked completed
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async isTodoCompleted(text) {
    const todo = this.getTodoByText(text);
    return todo.getByRole('checkbox').isChecked();
  }
}

module.exports = { TodoPage };
