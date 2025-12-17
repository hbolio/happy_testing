import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../constants';

export const SELECTORS = {
  heading: 'h1:has-text("Sugerencias de Platillos")',
  addDishLink: 'a[href="/dishes/new"]',
  dishCard: '[class*="shadow"]', // Generic card selector
  editLink: 'a[href*="/dishes/"][href*="edit"]', // Not used, but for reference
  deleteButton: 'button:has-text("Eliminar")',
};

export class DishesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly addDishLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1:has-text("Sugerencias de Platillos")');
    this.addDishLink = page.locator('a[href="/dishes/new"]');
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/dishes`);
  }

  async clickAddDish() {
    await this.addDishLink.click();
  }

  async getFirstDishTitle() {
    const firstDish = this.page.locator('h2').first();
    return firstDish.innerText();
  }

  async clickEditFirstDish() {
    const editLink = this.page.locator('a[href*="/dishes/"][href*="/"]').first();
    await editLink.click();
  }

  async clickDeleteFirstDish() {
    const deleteBtn = this.page.locator('button:has-text("Eliminar")').first();
    await deleteBtn.click();
  }

  async getDeleteButtonsCount() {
    return this.page.locator('button:has-text("Eliminar")').count();
  }
}
