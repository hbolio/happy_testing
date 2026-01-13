# NutriApp E2E Test Suite - Quick Start Guide

## Overview
Comprehensive end-to-end test suite for NutriApp (recipe management application) using Playwright. The test suite covers **50 test cases** across 2 test files with 7 Page Objects following industry best practices.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
# Server starts on http://localhost:3001
```

### 3. Run Tests
```bash
# Run all tests
npx playwright test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test playwright/specs/home.spec.ts
npx playwright test playwright/specs/dishes.spec.ts

# Run specific test by name
npx playwright test -g "can create a new dish"

# Debug mode
npx playwright test --debug
```

## Test Suite Structure

### Test Files
- **home.spec.ts** - 21 tests for authentication, registration, and navigation
- **dishes.spec.ts** - 29 tests for recipe CRUD operations and form validation

### Page Objects (POM)
- **HomePage.ts** - Landing page interactions
- **LoginPage.ts** - Login form handling
- **RegisterPage.ts** - Registration form handling
- **DishesPage.ts** - Recipe list page
- **NewDishForm.ts** - Recipe creation form
- **EditDishForm.ts** - Recipe editing form
- **ViewDishPage.ts** - Recipe detail view

### Test Data
Located in `playwright/constants.ts`:
- `TEST_USER` - Seeded test account
- `TEST_DATA` - Multiple test datasets for different scenarios

### Fixtures & Helpers
Located in `playwright/fixtures.ts`:
- `login()` - Authenticate with test user
- `logout()` - End authenticated session
- `loginAndGoDishes()` - Combined helper

## Test Coverage

| Feature | Test Count | Status |
|---------|-----------|--------|
| Landing Page | 4 | ✓ |
| Login & Authentication | 6 | ✓ |
| Registration | 4 | ✓ |
| Session Management | 4 | ✓ |
| Navigation | 3 | ✓ |
| Recipe List (Read) | 5 | ✓ |
| Recipe Creation (Create) | 6 | ✓ |
| Recipe Editing (Update) | 8 | ✓ |
| Recipe Deletion (Delete) | 3 | ✓ |
| Recipe Details View | 4 | ✓ |
| Form Validation | 3 | ✓ |
| **TOTAL** | **50** | **✓** |

## Test Scenarios

### Authentication Flow
- User login with correct/incorrect credentials
- User registration with validation
- Session management (logout)
- Navigation between auth pages

### Recipe Management (CRUD)
- **Create:** Add new recipes with multiple steps
- **Read:** View recipe lists and details
- **Update:** Edit recipe information and steps
- **Delete:** Remove recipes from the system

### Form Testing
- Field validation and required fields
- Numeric input handling (time, calories)
- Multi-step input handling
- Image URL field validation

### Navigation
- Page-to-page navigation
- Header navigation links
- Redirect after actions (login, create, edit, delete)

## Test User Credentials
```
Email: test@nutriapp.com
Password: nutriapp123
```

## Application Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dishes` - Recipe list
- `/dishes/new` - Create recipe
- `/dishes/[id]` - Edit recipe
- `/dishes/[id]/view` - View recipe details

## Configuration

### Environment Variables
- `BASE_URL` - Application URL (default: http://localhost:3001)

### Browser Configuration
- Default: Chromium
- Viewport: Desktop
- Timeout: 30 seconds (adjustable per test)

## Best Practices Implemented

✓ **Page Object Model** - Centralized selectors and actions  
✓ **Test Organization** - Logical grouping with describe blocks  
✓ **Reusable Fixtures** - DRY principle applied  
✓ **Test Data Management** - Centralized constants  
✓ **Meaningful Assertions** - Clear error messages  
✓ **Proper Waits** - Correct wait conditions instead of hard delays  
✓ **Maintainability** - Clear naming and documentation  

## Key Features

### Form Testing
- Multiple input types (text, textarea, number, checkbox)
- Dynamic step addition/removal
- Form submission and validation
- Pre-filled data in edit forms

### Authentication
- Login and registration flows
- Session persistence
- Protected routes
- Error handling

### CRUD Operations
- Full lifecycle testing
- Create with dynamic data
- Update specific fields
- Delete and verify removal
- View complete details

### Navigation
- Header navigation
- Redirect after actions
- Page-to-page flows
- Link accessibility

## Troubleshooting

### Tests Fail Due to Port in Use
The server may be running on a different port. Check the startup message and update `BASE_URL` in constants if needed.

### Element Not Found
Wait times may need adjustment. Tests include appropriate wait conditions, but slow systems may need timeout increases.

### State Issues
Tests run independently with login in beforeEach. If tests are interfering, clear browser cache between runs.

## Documentation

Complete test documentation available in `playwright/TEST_DOCUMENTATION.md`:
- Detailed POM structure
- Test case descriptions
- Test flow diagrams
- Known limitations
- Future improvements

## Running Tests in CI/CD

```bash
# Headless mode (no GUI)
npx playwright test

# Generate HTML report
npx playwright test --reporter=html

# Run with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Performance Notes

- Average test execution: ~2-3 seconds per test
- Total suite runtime: ~3-5 minutes depending on system
- Network requests properly awaited
- Database operations included in test execution time

## Contact & Support

For issues with tests:
1. Check TEST_DOCUMENTATION.md for detailed information
2. Verify application is running on correct port
3. Ensure test user exists in database (run `npm run seed` if needed)
4. Check browser console for JavaScript errors

## Next Steps

- Extend tests for API validation
- Add visual regression testing
- Implement accessibility testing
- Add performance benchmarks
- Create mobile-specific tests

