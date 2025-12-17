import { test as base } from '@playwright/test';
import { BASE_URL, TEST_USER } from './constants';

type MyFixtures = {
  // page is available from Playwright base fixtures
};

export const test = base.extend<MyFixtures>({});

export const login = async (page) => {
  await page.goto(BASE_URL);
  await page.click('a[href="/login"]');
  await page.fill('input[name="email"]', TEST_USER.email);
  await page.fill('input[name="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dishes');
};

export const expect = base.expect;
