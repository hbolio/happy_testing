import { test as base } from '@playwright/test';
import { BASE_URL, TEST_USER } from './constants';
import { LoginPage } from './pom/LoginPage';
import { HomePage } from './pom/HomePage';

type MyFixtures = {
  // page is available from Playwright base fixtures
};

export const test = base.extend<MyFixtures>({});

/**
 * Login helper function - logs in with the test user
 */
export const login = async (page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_USER.email, TEST_USER.password);
  await page.waitForURL('**/dishes', { timeout: 10000 });
};

/**
 * Logout helper function
 */
export const logout = async (page) => {
  const homePage = new HomePage(page);
  await homePage.page.locator('button:has-text("Logout")').click();
  await page.waitForURL('**/');
};

/**
 * Login and navigate to dishes page
 */
export const loginAndGoDishes = async (page) => {
  await login(page);
  await page.goto(`${BASE_URL}/dishes`);
};

export const expect = base.expect;
