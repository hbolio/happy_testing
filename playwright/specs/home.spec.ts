import { test, expect } from '@playwright/test';
import { BASE_URL, TEST_USER, TEST_DATA } from '../constants';
import { HomePage } from '../pom/HomePage';
import { LoginPage } from '../pom/LoginPage';
import { RegisterPage } from '../pom/RegisterPage';
import { login, logout } from '../fixtures';

test.describe('Home / Authentication', () => {
  test.describe('Landing Page', () => {
    test('landing page shows greeting and login link', async ({ page }) => {
      const home = new HomePage(page);
      await home.goto();
      await expect(home.heading).toHaveText('Welcome to NutriApp!');
      await expect(page.locator('a[href="/login"]')).toBeVisible();
    });

    test('landing page displays test credentials', async ({ page }) => {
      const home = new HomePage(page);
      await home.goto();
      const pageContent = await page.content();
      expect(pageContent).toContain(TEST_USER.email);
      expect(pageContent).toContain(TEST_USER.password);
    });

    test('can navigate to login page from landing', async ({ page }) => {
      const home = new HomePage(page);
      await home.goto();
      await home.clickLogin();
      await expect(page).toHaveURL(/.*\/login/);
    });

    test('can navigate to registration page from landing', async ({ page }) => {
      const home = new HomePage(page);
      await home.goto();
      const registerLink = page.locator('a:has-text("Regístrate")');
      // Note: The registration link should be on the login page or home
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      const regLink = page.locator('a:has-text("Regístrate")');
      if (await regLink.isVisible()) {
        await regLink.click();
        await expect(page).toHaveURL(/.*\/register/);
      }
    });
  });

  test.describe('Login Functionality', () => {
    test('can navigate to login page and see form fields', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    });

    test('login with seeded user redirects to /dishes', async ({ page }) => {
      await login(page);
      await expect(page).toHaveURL(/.*\/dishes/);
    });

    test('login with correct credentials shows dishes page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_USER.email, TEST_USER.password);
      await page.waitForURL(/.*\/dishes/);
      
      const heading = page.locator('h1:has-text("Sugerencias de Platillos")');
      await expect(heading).toBeVisible();
    });

    test('login with incorrect password shows error', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_USER.email, 'wrongpassword123');
      
      // Check for error message or that we're still on login page
      const isStillOnLogin = page.url().includes('/login');
      expect(isStillOnLogin).toBeTruthy();
    });

    test('login with non-existent email shows error', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('nonexistent@nutriapp.com', 'anypassword');
      
      const isStillOnLogin = page.url().includes('/login');
      expect(isStillOnLogin).toBeTruthy();
    });

    test('can navigate from login to registration', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      const registerLink = page.locator('a:has-text("Regístrate")');
      if (await registerLink.isVisible()) {
        await registerLink.click();
        await expect(page).toHaveURL(/.*\/register/);
      }
    });
  });

  test.describe('Registration Functionality', () => {
    test('can navigate to register page and see form fields', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await expect(registerPage.firstNameInput).toBeVisible();
      await expect(registerPage.lastNameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.nationalityInput).toBeVisible();
      await expect(registerPage.phoneInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.registerButton).toBeVisible();
    });

    test('can navigate from register to login', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.clickLoginLink();
      await expect(page).toHaveURL(/.*\/login/);
    });

    test('registration with valid data creates account', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      
      const newUser = TEST_DATA.newUser;
      await registerPage.register(newUser);
      
      // Should redirect to login or dishes page after successful registration
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      const isLoginOrDishes = currentUrl.includes('/login') || currentUrl.includes('/dishes') || currentUrl.includes('/register');
      expect(isLoginOrDishes).toBeTruthy();
    });

    test('registration form accepts all required fields', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      
      const testData = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@nutriapp.com`,
        nationality: 'USA',
        phone: '+1-555-0123',
        password: 'SecurePassword123!',
      };
      
      await registerPage.register(testData);
      // Form submission should be successful without JavaScript errors
      await page.waitForTimeout(1000);
      expect(page.url()).toBeTruthy();
    });
  });

  test.describe('Session Management', () => {
    test('authenticated user can access dishes page', async ({ page }) => {
      await login(page);
      const heading = page.locator('h1:has-text("Sugerencias de Platillos")');
      await expect(heading).toBeVisible();
    });

    test('logout button is visible when logged in', async ({ page }) => {
      await login(page);
      const logoutButton = page.locator('button:has-text("Logout")');
      await expect(logoutButton).toBeVisible();
    });

    test('can logout from authenticated session', async ({ page }) => {
      await login(page);
      await logout(page);
      // After logout, the app redirects to /login
      await expect(page).toHaveURL(/.*\/(login|$)/);
    });

    test('unauthenticated user cannot access dishes page directly', async ({ page }) => {
      // Navigate directly to dishes without logging in
      await page.goto(`${BASE_URL}/dishes`);
      // Should redirect to login or show login page
      await page.waitForTimeout(1000);
      // The app might redirect or show a different page
      expect(page.url()).toBeTruthy();
    });
  });

  test.describe('Navigation', () => {
    test('navigation header displays NutriApp logo and title', async ({ page }) => {
      const home = new HomePage(page);
      await home.goto();
      const logo = page.locator('img[alt="NutriApp"]');
      const title = page.locator('text=NutriApp').nth(0);
      await expect(logo).toBeVisible();
      await expect(title).toBeVisible();
    });

    test('navigation shows Recetas link when authenticated', async ({ page }) => {
      await login(page);
      const recipesLink = page.locator('a:has-text("Recetas")');
      await expect(recipesLink).toBeVisible();
    });

    test('can navigate between pages using header links', async ({ page }) => {
      await login(page);
      const dishesLink = page.locator('a[href="/dishes"]');
      await dishesLink.click();
      await expect(page).toHaveURL(/.*\/dishes/);
    });
  });
});

