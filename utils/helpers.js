/**
 * utils/helpers.js
 * Shared utility functions for the Playwright test suite.
 */

/**
 * Generate a unique todo item name with a timestamp suffix
 * Useful for avoiding collisions in parallel test runs.
 * @param {string} prefix
 * @returns {string}
 */
function uniqueTodo(prefix = 'Todo') {
  return `${prefix} - ${Date.now()}`;
}

/**
 * Wait for a given number of milliseconds.
 * Use sparingly — prefer Playwright's built-in waiting mechanisms.
 * @param {number} ms
 */
async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize whitespace in a string (trim + collapse internal spaces)
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
  return text.trim().replace(/\s+/g, ' ');
}

module.exports = { uniqueTodo, wait, normalizeText };
