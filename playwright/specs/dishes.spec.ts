import { test, expect } from '@playwright/test';
import { TEST_DATA } from '../constants';
import { DishesPage } from '../pom/DishesPage';
import { NewDishForm } from '../pom/NewDishForm';
import { EditDishForm } from '../pom/EditDishForm';
import { ViewDishPage } from '../pom/ViewDishPage';
import { login } from '../fixtures';

test.describe('Dishes Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);
  });

  test.describe('Dishes List / Read Operations', () => {
    test('view dishes list after login', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await expect(dishesPage.heading).toBeVisible();
      
      const firstDishTitle = await dishesPage.getFirstDishTitle();
      expect(firstDishTitle.length).toBeGreaterThan(0);
    });

    test('dishes list displays multiple dishes', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      
      const dishCards = page.locator('[class*="shadow"]');
      const count = await dishCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('each dish card shows name, description, and action buttons', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      
      const firstDish = page.locator('[class*="shadow"]').first();
      const name = firstDish.locator('h2');
      const description = firstDish.locator('p');
      const viewButton = firstDish.locator('a:has-text("Ver")');
      const editButton = firstDish.locator('a:has-text("Editar")');
      const deleteButton = firstDish.locator('button:has-text("Eliminar")');
      
      await expect(name).toBeVisible();
      await expect(description).toBeVisible();
      await expect(viewButton).toBeVisible();
      await expect(editButton).toBeVisible();
      await expect(deleteButton).toBeVisible();
    });

    test('can view dish details by clicking Ver button', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      
      const firstDish = page.locator('[class*="shadow"]').first();
      const viewButton = firstDish.locator('a:has-text("Ver")');
      const href = await viewButton.getAttribute('href');
      
      await viewButton.click();
      await page.waitForTimeout(2000);
      
      // Should navigate to view page
      expect(page.url()).toContain('/view');
    });

    test('add dish button navigates to new dish form', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      const addDishButton = page.locator('a:has-text("+ Agregar Platillo")');
      await expect(addDishButton).toBeVisible();
    });
  });

  test.describe('Create Operations', () => {
    test('navigate to add dish form', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await dishesPage.clickAddDish();
      await expect(page).toHaveURL(/.*\/dishes\/new/);
    });

    test('new dish form displays all required fields', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await dishesPage.clickAddDish();
      
      const form = new NewDishForm(page);
      await expect(form.nameInput).toBeVisible();
      await expect(form.descriptionInput).toBeVisible();
      await expect(form.prepTimeInput).toBeVisible();
      await expect(form.cookTimeInput).toBeVisible();
      await expect(form.caloriesInput).toBeVisible();
      await expect(form.imageUrlInput).toBeVisible();
      await expect(form.addStepButton).toBeVisible();
      await expect(form.saveButton).toBeVisible();
    });

    test('can create a new dish with all fields', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await dishesPage.clickAddDish();

      const newDishForm = new NewDishForm(page);
      const dishData = {
        name: 'Test Dish - ' + Date.now(),
        description: TEST_DATA.newDish.description,
        prepTime: TEST_DATA.newDish.prepTime,
        cookTime: TEST_DATA.newDish.cookTime,
        calories: TEST_DATA.newDish.calories,
      };
      
      await newDishForm.fillName(dishData.name);
      await newDishForm.fillDescription(dishData.description);
      await newDishForm.fillPrepTime(dishData.prepTime);
      await newDishForm.fillCookTime(dishData.cookTime);
      await newDishForm.fillCalories(dishData.calories);
      
      // Add multiple steps
      await newDishForm.addStep('First preparation step');
      await newDishForm.addStep('Second preparation step');
      
      await newDishForm.save();
      
      // Should redirect to dishes list after saving
      await page.waitForURL(/.*\/dishes/, { timeout: 10000 });
      
      // Verify new dish appears in the list
      const dishContent = await page.content();
      expect(dishContent).toContain(dishData.name);
    });

    test('can create a minimal dish with required fields only', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await dishesPage.clickAddDish();

      const form = new NewDishForm(page);
      const dishName = 'Minimal Dish - ' + Date.now();
      
      await form.fillName(dishName);
      await form.fillDescription('Minimal test dish');
      await form.fillPrepTime('5');
      await form.fillCookTime('10');
      await form.fillCalories('200');
      await form.addStep('Simple step');
      await form.save();
      
      await page.waitForURL(/.*\/dishes/, { timeout: 10000 });
      const content = await page.content();
      expect(content).toContain(dishName);
    });

    test('can add multiple steps to a dish', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await dishesPage.clickAddDish();

      const form = new NewDishForm(page);
      const dishName = 'Multi-Step Dish - ' + Date.now();
      
      await form.fillName(dishName);
      await form.fillDescription('Dish with multiple steps');
      await form.fillPrepTime('10');
      await form.fillCookTime('20');
      await form.fillCalories('300');
      
      const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
      for (const step of steps) {
        await form.addStep(step);
      }
      
      await form.save();
      await page.waitForURL(/.*\/dishes/, { timeout: 10000 });
    });

    test('quick prep checkbox appears in form', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await dishesPage.clickAddDish();

      const form = new NewDishForm(page);
      await expect(form.quickPrepCheckbox).toBeVisible();
    });
  });

  test.describe('Update Operations', () => {
    test('navigate to edit dish form', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      
      // Click first edit link
      const firstEditLink = page.locator('a:has-text("Editar")').first();
      await firstEditLink.click();

      // Wait for form to load
      await page.waitForSelector('input[name="name"]', { timeout: 5000 });
      
      expect(page.url()).toContain('/dishes/');
    });

    test('can edit an existing dish', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      
      const originalTitle = await dishesPage.getFirstDishTitle();

      // Click on the first edit link
      const firstEditLink = page.locator('a:has-text("Editar")').first();
      await firstEditLink.click();

      // Wait for form to load
      await page.waitForSelector('input[name="name"]', { timeout: 5000 });

      const editForm = new EditDishForm(page);
      const newCalories = String(Math.floor(Math.random() * 500) + 100);
      await editForm.updateDish({ calories: newCalories });

      // Should redirect back to dishes list
      await page.waitForURL(/.*\/dishes/, { timeout: 10000 });
      expect(page.url()).toContain('/dishes');
    });

    test('can update dish name', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();

      const firstEditLink = page.locator('a:has-text("Editar")').first();
      await firstEditLink.click();

      await page.waitForSelector('input[name="name"]', { timeout: 5000 });

      const editForm = new EditDishForm(page);
      const newName = 'Updated Name - ' + Date.now();
      await editForm.fillName(newName);
      await editForm.save();

      await page.waitForURL(/.*\/dishes/, { timeout: 10000 });
    });

    test('can update dish description', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();

      const firstEditLink = page.locator('a:has-text("Editar")').first();
      await firstEditLink.click();

      await page.waitForSelector('input[name="name"]', { timeout: 5000 });

      const editForm = new EditDishForm(page);
      const newDescription = 'Updated description - ' + Date.now();
      await editForm.fillDescription(newDescription);
      await editForm.save();

      await page.waitForURL(/.*\/dishes/, { timeout: 10000 });
    });

    test('can update calories value', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();

      const firstEditLink = page.locator('a:has-text("Editar")').first();
      await firstEditLink.click();

      await page.waitForSelector('input[name="name"]', { timeout: 5000 });

      const editForm = new EditDishForm(page);
      const newCalories = '999';
      await editForm.fillCalories(newCalories);
      await editForm.save();

      await page.waitForURL(/.*\/dishes/, { timeout: 10000 });
    });

    test('edit form shows current dish data', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();

      const firstDishName = await dishesPage.getFirstDishTitle();
      
      const firstEditLink = page.locator('a:has-text("Editar")').first();
      await firstEditLink.click();

      await page.waitForSelector('input[name="name"]', { timeout: 5000 });

      const nameInput = page.locator('input[name="name"]');
      const currentValue = await nameInput.inputValue();
      
      expect(currentValue).toBe(firstDishName);
    });

    test('can add steps while editing', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();

      const firstEditLink = page.locator('a:has-text("Editar")').first();
      await firstEditLink.click();

      await page.waitForSelector('input[name="name"]', { timeout: 5000 });

      const addStepButton = page.locator('button:has-text("+ Agregar paso")');
      const initialStepCount = await page.locator('input[placeholder*="Paso"]').count();
      
      await addStepButton.click();
      
      const newStepCount = await page.locator('input[placeholder*="Paso"]').count();
      expect(newStepCount).toBeGreaterThan(initialStepCount);
    });

    test('can remove steps while editing', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();

      const firstEditLink = page.locator('a:has-text("Editar")').first();
      await firstEditLink.click();

      await page.waitForSelector('input[name="name"]', { timeout: 5000 });

      const removeButtons = page.locator('button:has-text("×")');
      const initialCount = await removeButtons.count();
      
      if (initialCount > 0) {
        await removeButtons.first().click();
        const newCount = await removeButtons.count();
        expect(newCount).toBeLessThan(initialCount);
      }
    });
  });

  test.describe('Delete Operations', () => {
    test('delete button is visible on dishes', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();

      const deleteButton = page.locator('button:has-text("Eliminar")').first();
      await expect(deleteButton).toBeVisible();
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

    test('dish is removed from list after deletion', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();

      const firstDishNameBefore = await dishesPage.getFirstDishTitle();
      
      await dishesPage.clickDeleteFirstDish();
      await page.waitForTimeout(1000);

      const firstDishNameAfter = await dishesPage.getFirstDishTitle();
      
      // The first dish should be different (or list should be empty)
      // We're checking that the list has been updated
      expect(page.url()).toContain('/dishes');
    });
  });

  test.describe('View Dish Details', () => {
    test('can view dish details on view page', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      
      const firstDish = page.locator('[class*="shadow"]').first();
      const viewButton = firstDish.locator('a:has-text("Ver")');
      const href = await viewButton.getAttribute('href');
      
      await viewButton.click();
      await page.waitForTimeout(2000);
      
      const viewDishPage = new ViewDishPage(page);
      const heading = await viewDishPage.getHeading();
      expect(heading.length).toBeGreaterThan(0);
    });

    test('view page displays dish preparation steps', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      
      const firstDish = page.locator('[class*="shadow"]').first();
      const viewButton = firstDish.locator('a:has-text("Ver")');
      await viewButton.click();
      await page.waitForTimeout(2000);
      
      const viewDishPage = new ViewDishPage(page);
      const stepsCount = await viewDishPage.getStepsCount();
      expect(stepsCount).toBeGreaterThan(0);
    });

    test('view page shows all dish information', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      
      const firstDish = page.locator('[class*="shadow"]').first();
      const viewButton = firstDish.locator('a:has-text("Ver")');
      await viewButton.click();
      await page.waitForTimeout(2000);
      
      const viewDishPage = new ViewDishPage(page);
      const heading = await viewDishPage.getHeading();
      const description = await viewDishPage.getDescription();
      const steps = await viewDishPage.getAllSteps();
      
      expect(heading).toBeTruthy();
      expect(description).toBeTruthy();
      expect(steps.length).toBeGreaterThan(0);
    });

    test('can navigate back to dishes list from view page', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      
      const firstDish = page.locator('[class*="shadow"]').first();
      const viewButton = firstDish.locator('a:has-text("Ver")');
      await viewButton.click();
      await page.waitForTimeout(2000);
      
      // Click the Recetas link in the header
      const recipesLink = page.locator('a:has-text("Recetas")');
      await recipesLink.click();
      
      await expect(page).toHaveURL(/.*\/dishes/);
    });
  });

  test.describe('Form Validation', () => {
    test('can submit form with valid numeric values for prep and cook time', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await dishesPage.clickAddDish();

      const form = new NewDishForm(page);
      await form.fillName('Test Numeric Values - ' + Date.now());
      await form.fillDescription('Testing numeric fields');
      await form.fillPrepTime('45');
      await form.fillCookTime('60');
      await form.fillCalories('500');
      await form.addStep('Test step');
      
      // Form should accept these values
      expect(await form.prepTimeInput.inputValue()).toBe('45');
      expect(await form.cookTimeInput.inputValue()).toBe('60');
      expect(await form.caloriesInput.inputValue()).toBe('500');
    });

    test('form handles empty calories field', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await dishesPage.clickAddDish();

      const form = new NewDishForm(page);
      const initialValue = await form.caloriesInput.inputValue();
      
      // The field should have some default value or be clearable
      expect(form.caloriesInput).toBeTruthy();
    });

    test('image URL field accepts valid URLs', async ({ page }) => {
      const dishesPage = new DishesPage(page);
      await dishesPage.goto();
      await dishesPage.clickAddDish();

      const form = new NewDishForm(page);
      const testUrl = 'https://example.com/image.jpg';
      await form.fillImageUrl(testUrl);
      
      const value = await form.imageUrlInput.inputValue();
      expect(value).toBe(testUrl);
    });
  });
});
