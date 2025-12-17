import { test, expect } from '@playwright/test';
import { DishesPage } from '../pom/DishesPage';
import { NewDishForm } from '../pom/NewDishForm';
import { EditDishForm } from '../pom/EditDishForm';
import { login } from '../fixtures';

test.describe('Dishes Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);
  });

  test('view dishes list after login', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    await dishesPage.goto();
    await expect(dishesPage.heading).toBeVisible();
    
    const firstDishTitle = await dishesPage.getFirstDishTitle();
    expect(firstDishTitle.length).toBeGreaterThan(0);
  });

  test('navigate to add dish form', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    await dishesPage.goto();
    await dishesPage.clickAddDish();
    await expect(page).toHaveURL(/.*\/dishes\/new/);
  });

  test('can create a new dish', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    await dishesPage.goto();
    await dishesPage.clickAddDish();

    const newDishForm = new NewDishForm(page);
    const dishData = {
      name: 'Test Dish - ' + Date.now(),
      description: 'Esta es una prueba de platillo creado por Playwright',
      prepTime: '10',
      cookTime: '15',
      calories: '300',
    };
    
    await newDishForm.createDish(dishData);
    
    // Should redirect to dishes list after saving
    await expect(page).toHaveURL(/.*\/dishes/);
    await page.waitForTimeout(1000); // Wait for page to update
    
    // Verify new dish appears in the list
    const dishContent = await page.content();
    expect(dishContent).toContain(dishData.name);
  });

  test('can edit an existing dish', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    await dishesPage.goto();
    
    const originalTitle = await dishesPage.getFirstDishTitle();

    // Click on the first edit link (it follows the pattern /dishes/[id])
    const firstEditLink = page.locator('a:has-text("Editar")').first();
    await firstEditLink.click();

    // Wait for form to load
    await page.waitForSelector('input[name="name"]', { timeout: 5000 });

    const editForm = new EditDishForm(page);
    const newCalories = String(Math.floor(Math.random() * 500) + 100);
    await editForm.updateDish({ calories: newCalories });

    // Should redirect back to dishes list
    await expect(page).toHaveURL(/.*\/dishes/);
    await page.waitForTimeout(500);
  });

  test('can delete a dish', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    await dishesPage.goto();

    const initialCount = await dishesPage.getDeleteButtonsCount();
    expect(initialCount).toBeGreaterThan(0);

    // Delete the first dish
    await dishesPage.clickDeleteFirstDish();

    // Wait for the page to update
    await page.waitForTimeout(1000);

    // Count should decrease by 1
    const finalCount = await dishesPage.getDeleteButtonsCount();
    expect(finalCount).toBeLessThan(initialCount);
  });
});
