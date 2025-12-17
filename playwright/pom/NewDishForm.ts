import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../constants';

export const SELECTORS = {
  nameInput: 'input[name="name"]',
  descriptionInput: 'textarea[name="description"]',
  quickPrepCheckbox: 'input[name="quickPrep"]',
  prepTimeInput: 'input[name="prepTime"]',
  cookTimeInput: 'input[name="cookTime"]',
  caloriesInput: 'input[name="calories"]',
  imageUrlInput: 'input[name="imageUrl"]',
  stepInputs: 'input[placeholder*="Paso"]',
  addStepButton: 'button:has-text("+ Agregar paso")',
  saveButton: 'button:has-text("Guardar")',
};

export class NewDishForm {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly quickPrepCheckbox: Locator;
  readonly prepTimeInput: Locator;
  readonly cookTimeInput: Locator;
  readonly caloriesInput: Locator;
  readonly imageUrlInput: Locator;
  readonly addStepButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator(SELECTORS.nameInput);
    this.descriptionInput = page.locator(SELECTORS.descriptionInput);
    this.quickPrepCheckbox = page.locator(SELECTORS.quickPrepCheckbox);
    this.prepTimeInput = page.locator(SELECTORS.prepTimeInput);
    this.cookTimeInput = page.locator(SELECTORS.cookTimeInput);
    this.caloriesInput = page.locator(SELECTORS.caloriesInput);
    this.imageUrlInput = page.locator(SELECTORS.imageUrlInput);
    this.addStepButton = page.locator(SELECTORS.addStepButton);
    this.saveButton = page.locator(SELECTORS.saveButton);
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/dishes/new`);
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async fillPrepTime(time: string) {
    await this.prepTimeInput.fill(time);
  }

  async fillCookTime(time: string) {
    await this.cookTimeInput.fill(time);
  }

  async fillCalories(calories: string) {
    await this.caloriesInput.fill(calories);
  }

  async fillImageUrl(url: string) {
    await this.imageUrlInput.fill(url);
  }

  async addStep(stepText: string) {
    const inputs = this.page.locator(SELECTORS.stepInputs);
    const count = await inputs.count();
    await this.addStepButton.click();
    const newInput = inputs.nth(count);
    await newInput.fill(stepText);
  }

  async save() {
    await this.saveButton.click();
  }

  async createDish(dishData: { name: string; description: string; prepTime: string; cookTime: string; calories: string }) {
    await this.fillName(dishData.name);
    await this.fillDescription(dishData.description);
    await this.fillPrepTime(dishData.prepTime);
    await this.fillCookTime(dishData.cookTime);
    await this.fillCalories(dishData.calories);
    await this.addStep('Paso de preparación de ejemplo');
    await this.save();
  }
}
