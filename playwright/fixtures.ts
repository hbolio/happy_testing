import { test as base } from '@playwright/test';
import { BASE_URL, TEST_USER } from './constants';
import { LoginPage } from './pom/LoginPage';

type MyFixtures = {
  // page is available from Playwright base fixtures
};

export const test = base.extend<MyFixtures>({});

export const login = async (page) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_USER.email, TEST_USER.password);
  await page.waitForURL('**/dishes', { timeout: 10000 });
};

export const expect = base.expect;
