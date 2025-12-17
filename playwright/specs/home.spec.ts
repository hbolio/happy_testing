import { test, expect } from '@playwright/test';
import { BASE_URL } from '../constants';
import { HomePage } from '../pom/HomePage';
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
});
