import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../constants';

export class EditDishForm {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly prepTimeInput: Locator;
  readonly cookTimeInput: Locator;
  readonly caloriesInput: Locator;
  readonly imageUrlInput: Locator;
  readonly addStepButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.prepTimeInput = page.locator('input[name="prepTime"]');
    this.cookTimeInput = page.locator('input[name="cookTime"]');
    this.caloriesInput = page.locator('input[name="calories"]');
    this.imageUrlInput = page.locator('input[name="imageUrl"]');
    this.addStepButton = page.locator('button:has-text("+ Agregar paso")');
    this.saveButton = page.locator('button:has-text("Guardar")');
  }

  async gotoEditDish(dishId: number) {
    await this.page.goto(`${BASE_URL}/dishes/${dishId}`);
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async fillCalories(calories: string) {
    await this.caloriesInput.fill(calories);
  }

  async save() {
    await this.saveButton.click();
  }

  async updateDish(updates: { name?: string; calories?: string }) {
    if (updates.name) {
      await this.fillName(updates.name);
    }
    if (updates.calories) {
      await this.fillCalories(updates.calories);
    }
    await this.save();
  }
}
