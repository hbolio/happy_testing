import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../constants';

export const SELECTORS = {
  heading: 'h2',
  description: 'p',
  stepsHeading: 'h3:has-text("Pasos")',
  stepsList: 'ol li',
};

export class ViewDishPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly description: Locator;
  readonly stepsHeading: Locator;
  readonly stepsList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h2').first();
    // Get the second paragraph which is the description (first might be in another element)
    this.description = page.locator('p').first();
    this.stepsHeading = page.locator('h3:has-text("Pasos")');
    this.stepsList = page.locator('ol li');
  }

  async gotoViewDish(dishId: number) {
    await this.page.goto(`${BASE_URL}/dishes/${dishId}/view`);
    // Wait for the page to load
    await this.page.waitForURL(/.*\/view/, { timeout: 10000 });
  }

  async getHeading() {
    return this.heading.innerText();
  }

  async getDescription() {
    return this.description.innerText();
  }

  async getStepsCount() {
    return this.stepsList.count();
  }

  async getStepText(stepIndex: number) {
    return this.stepsList.nth(stepIndex).innerText();
  }

  async getAllSteps() {
    const count = await this.getStepsCount();
    const steps = [];
    for (let i = 0; i < count; i++) {
      steps.push(await this.getStepText(i));
    }
    return steps;
  }
}
