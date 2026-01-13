import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../constants';

export const SELECTORS = {
  firstNameInput: 'input[name="firstName"]',
  lastNameInput: 'input[name="lastName"]',
  emailInput: 'input[name="email"]',
  nationalityInput: 'input[name="nationality"]',
  phoneInput: 'input[name="phone"]',
  passwordInput: 'input[name="password"]',
  registerButton: 'button:has-text("Registrarse")',
  loginLink: 'a:has-text("Inicia sesión")',
};

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly nationalityInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator(SELECTORS.firstNameInput);
    this.lastNameInput = page.locator(SELECTORS.lastNameInput);
    this.emailInput = page.locator(SELECTORS.emailInput);
    this.nationalityInput = page.locator(SELECTORS.nationalityInput);
    this.phoneInput = page.locator(SELECTORS.phoneInput);
    this.passwordInput = page.locator(SELECTORS.passwordInput);
    this.registerButton = page.locator(SELECTORS.registerButton);
    this.loginLink = page.locator(SELECTORS.loginLink);
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/register`);
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillNationality(nationality: string) {
    await this.nationalityInput.fill(nationality);
  }

  async fillPhone(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.registerButton.click();
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    nationality: string;
    phone: string;
    password: string;
  }) {
    await this.fillFirstName(userData.firstName);
    await this.fillLastName(userData.lastName);
    await this.fillEmail(userData.email);
    await this.fillNationality(userData.nationality);
    await this.fillPhone(userData.phone);
    await this.fillPassword(userData.password);
    await this.submit();
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }
}
