/**
 * test-data/todos.js
 * Centralised test data constants for the TodoMVC test suite.
 */
const TODOS = {
  // Default todo items used across multiple tests
  defaultItems: [
    'Buy groceries',
    'Write automation tests',
    'Review pull requests',
  ],

  // Single item scenarios
  singleItem: 'Walk the dog',

  // Edge case data
  longText: 'A'.repeat(200),
  emptyText: '',
  specialChars: 'Todo with special chars !@#$%^&*()',

  // Edited text
  editedItem: 'Walk the dog — EDITED',
};

module.exports = { TODOS };
