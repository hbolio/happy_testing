import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../constants';

export const SELECTORS = {
  emailInput: 'input[name="email"]',
  passwordInput: 'input[name="password"]',
  submitButton: 'button[type="submit"]:has-text("Iniciar sesión")',
};

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator(SELECTORS.emailInput);
    this.passwordInput = page.locator(SELECTORS.passwordInput);
    this.submitButton = page.locator(SELECTORS.submitButton);
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/login`);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}
