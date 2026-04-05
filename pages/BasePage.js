/**
 * BasePage.js
 * Abstract base class for all Page Objects.
 * Contains shared methods reused across pages.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a given path relative to baseURL
   * @param {string} path
   */
  async navigate(path = '/') {
    await this.page.goto(path);
  }

  /**
   * Wait for the page to be in a stable loaded state
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get the current page title
   * @returns {Promise<string>}
   */
  async getTitle() {
    return this.page.title();
  }

  /**
   * Get the current page URL
   * @returns {string}
   */
  getURL() {
    return this.page.url();
  }

  /**
   * Take a screenshot with a given name
   * @param {string} name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `reports/${name}.png`, fullPage: true });
  }
}

module.exports = { BasePage };
