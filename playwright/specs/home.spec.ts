import { test, expect } from '@playwright/test';
import { BASE_URL } from '../constants';
import { HomePage } from '../pom/HomePage';
import { LoginPage } from '../pom/LoginPage';
import { TEST_USER } from '../constants';
import { login } from '../fixtures';

test.describe('Home / Authentication', () => {
  test('landing page shows greeting and login link', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.heading).toHaveText('Welcome to NutriApp!');
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });

  test('login with seeded user redirects to /dishes', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/.*\/dishes/);
  });

  test('can navigate to login page and see form fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });
});

