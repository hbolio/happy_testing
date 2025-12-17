import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../constants';

export const SELECTORS = {
  heading: 'main h1',
  linkDishes: 'a[href="/dishes"]',
  linkLogin: 'a[href="/login"]',
  logoutButton: 'button:has-text("Logout")',
};

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly loginLink: Locator;
  readonly dishesLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator(SELECTORS.heading);
    this.loginLink = page.locator(SELECTORS.linkLogin);
    this.dishesLink = page.locator(SELECTORS.linkDishes);
  }

  async goto() {
    await this.page.goto(BASE_URL);
  }

  async clickLogin() {
    await this.loginLink.click();
  }

  async clickDishes() {
    await this.dishesLink.click();
  }

  async getHeadingText() {
    return this.heading.innerText();
  }
}
