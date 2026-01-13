# Test Suite File Index

## Quick Navigation

### 📋 Documentation Files
- **[TEST_CASE_CREATION_SUMMARY.md](TEST_CASE_CREATION_SUMMARY.md)** - Overview of all created test cases and deliverables
- **[PLAYWRIGHT_TESTS_README.md](PLAYWRIGHT_TESTS_README.md)** - Quick start guide for running tests
- **[TEST_EXECUTION_CHECKLIST.md](TEST_EXECUTION_CHECKLIST.md)** - Detailed checklist for test execution
- **[playwright/TEST_DOCUMENTATION.md](playwright/TEST_DOCUMENTATION.md)** - Comprehensive test documentation

### 🧪 Test Files (2 files, 50 tests total)
- **[playwright/specs/home.spec.ts](playwright/specs/home.spec.ts)** - 21 tests
  - Landing Page: 4 tests
  - Login Functionality: 6 tests
  - Registration Functionality: 4 tests
  - Session Management: 4 tests
  - Navigation: 3 tests

- **[playwright/specs/dishes.spec.ts](playwright/specs/dishes.spec.ts)** - 29 tests
  - Dishes List / Read Operations: 5 tests
  - Create Operations: 6 tests
  - Update Operations: 8 tests
  - Delete Operations: 3 tests
  - View Dish Details: 4 tests
  - Form Validation: 3 tests

### 🏗️ Page Object Models (7 files)
- **[playwright/pom/HomePage.ts](playwright/pom/HomePage.ts)** - Landing page interactions
- **[playwright/pom/LoginPage.ts](playwright/pom/LoginPage.ts)** - Login form handling
- **[playwright/pom/RegisterPage.ts](playwright/pom/RegisterPage.ts)** - Registration form handling
- **[playwright/pom/DishesPage.ts](playwright/pom/DishesPage.ts)** - Recipe list page
- **[playwright/pom/NewDishForm.ts](playwright/pom/NewDishForm.ts)** - Recipe creation form
- **[playwright/pom/EditDishForm.ts](playwright/pom/EditDishForm.ts)** - Recipe editing form
- **[playwright/pom/ViewDishPage.ts](playwright/pom/ViewDishPage.ts)** - Recipe detail view

### 🛠️ Configuration & Fixtures (2 files)
- **[playwright/constants.ts](playwright/constants.ts)** - Test data and URLs
- **[playwright/fixtures.ts](playwright/fixtures.ts)** - Reusable test fixtures

---

## File Details

### Test Specifications

#### home.spec.ts
**Location:** `playwright/specs/home.spec.ts`  
**Tests:** 21  
**Coverage:** Authentication, Registration, Session Management, Navigation

```typescript
// Test Suites:
// 1. Landing Page (4 tests)
// 2. Login Functionality (6 tests)
// 3. Registration Functionality (4 tests)
// 4. Session Management (4 tests)
// 5. Navigation (3 tests)
```

**Key Scenarios:**
- User login flow
- User registration
- Session management (logout)
- Page navigation
- Error handling

---

#### dishes.spec.ts
**Location:** `playwright/specs/dishes.spec.ts`  
**Tests:** 29  
**Coverage:** Recipe CRUD Operations, Form Validation, Navigation

```typescript
// Test Suites:
// 1. Dishes List / Read Operations (5 tests)
// 2. Create Operations (6 tests)
// 3. Update Operations (8 tests)
// 4. Delete Operations (3 tests)
// 5. View Dish Details (4 tests)
// 6. Form Validation (3 tests)
```

**Key Scenarios:**
- Create recipes with full details
- Edit existing recipes
- Delete recipes
- View recipe details
- Form validation

---

### Page Object Models

#### HomePage.ts
**Selectors:**
- `heading` - Main h1 element
- `linkDishes` - Link to dishes page
- `linkLogin` - Link to login page
- `logoutButton` - Logout button

**Methods:**
- `goto()` - Navigate to home
- `clickLogin()` - Click login link
- `clickDishes()` - Click dishes link
- `getHeadingText()` - Get heading text

---

#### LoginPage.ts
**Selectors:**
- `emailInput` - Email input field
- `passwordInput` - Password input field
- `submitButton` - Login submit button

**Methods:**
- `goto()` - Navigate to login
- `fillEmail()` - Fill email field
- `fillPassword()` - Fill password field
- `submit()` - Click submit button
- `login()` - Complete login action

---

#### RegisterPage.ts *(NEW)*
**Selectors:**
- `firstNameInput` - First name input
- `lastNameInput` - Last name input
- `emailInput` - Email input
- `nationalityInput` - Nationality input
- `phoneInput` - Phone input
- `passwordInput` - Password input
- `registerButton` - Submit button
- `loginLink` - Link to login page

**Methods:**
- `goto()` - Navigate to register
- `fillFirstName()` - Fill first name
- `fillLastName()` - Fill last name
- `fillEmail()` - Fill email
- `fillNationality()` - Fill nationality
- `fillPhone()` - Fill phone
- `fillPassword()` - Fill password
- `submit()` - Click register button
- `register()` - Complete registration
- `clickLoginLink()` - Navigate to login

---

#### DishesPage.ts
**Selectors:**
- `heading` - "Sugerencias de Platillos" heading
- `addDishLink` - Link to add new recipe
- `dishCard` - Recipe cards
- `deleteButton` - Delete button on cards

**Methods:**
- `goto()` - Navigate to dishes page
- `clickAddDish()` - Navigate to add dish form
- `getFirstDishTitle()` - Get first recipe name
- `clickEditFirstDish()` - Edit first recipe
- `clickDeleteFirstDish()` - Delete first recipe
- `getDeleteButtonsCount()` - Count delete buttons

---

#### NewDishForm.ts
**Selectors:**
- `nameInput` - Recipe name input
- `descriptionInput` - Recipe description textarea
- `prepTimeInput` - Preparation time input
- `cookTimeInput` - Cooking time input
- `caloriesInput` - Calories input
- `imageUrlInput` - Image URL input
- `quickPrepCheckbox` - Quick prep checkbox
- `addStepButton` - Add step button
- `saveButton` - Save button

**Methods:**
- `goto()` - Navigate to new dish page
- `fillName()` - Fill name
- `fillDescription()` - Fill description
- `fillPrepTime()` - Fill prep time
- `fillCookTime()` - Fill cook time
- `fillCalories()` - Fill calories
- `fillImageUrl()` - Fill image URL
- `addStep()` - Add preparation step
- `save()` - Submit form
- `createDish()` - Complete dish creation

---

#### EditDishForm.ts
**Methods:**
- `gotoEditDish()` - Navigate to specific dish edit page
- `fillName()` - Fill name
- `fillDescription()` - Fill description
- `fillCalories()` - Fill calories
- `save()` - Submit changes
- `updateDish()` - Update specific fields

---

#### ViewDishPage.ts *(NEW)*
**Methods:**
- `gotoViewDish()` - Navigate to view page
- `getHeading()` - Get recipe name
- `getDescription()` - Get description
- `getStepsCount()` - Count steps
- `getStepText()` - Get specific step text
- `getAllSteps()` - Get all steps

---

### Configuration Files

#### constants.ts
**Contents:**
- `BASE_URL` - Application URL (http://localhost:3001)
- `TEST_USER` - Seeded test account
- `TEST_DATA` - Multiple test datasets
  - `newDish` - Complete dish data
  - `updatedDish` - Update test data
  - `minimalDish` - Minimal required fields
  - `quickPrepDish` - Quick prep recipe
  - `newUser` - Registration test data
  - `invalidEmail` - Invalid email for validation
  - `invalidPassword` - Invalid password for validation

---

#### fixtures.ts
**Fixtures:**
- `login()` - Authenticate with test user
- `logout()` - End authenticated session
- `loginAndGoDishes()` - Combined login and navigation helper

---

## Test Statistics

| Category | Count |
|----------|-------|
| Total Test Cases | 50 |
| Test Files | 2 |
| Page Objects | 7 |
| Test Fixtures | 3 |
| Describe Blocks | 11 |
| Test Suites | 11 |
| Documentation Files | 4 |

---

## Coverage Summary

### Feature Coverage
- ✅ Authentication (Login/Register/Logout)
- ✅ User Session Management
- ✅ Recipe CRUD Operations
- ✅ Form Validation
- ✅ Navigation Flows
- ✅ Error Handling
- ✅ Data Persistence

### Test Type Distribution
- **Happy Path:** 30 tests (60%)
- **Error Cases:** 8 tests (16%)
- **Edge Cases:** 8 tests (16%)
- **Validation:** 4 tests (8%)

---

## Quick Commands

### Run All Tests
```bash
npx playwright test
```

### Run Specific File
```bash
npx playwright test playwright/specs/home.spec.ts
```

### Run Specific Test
```bash
npx playwright test -g "can create a new dish"
```

### Run with UI
```bash
npx playwright test --ui
```

### Debug Mode
```bash
npx playwright test --debug
```

### Generate Report
```bash
npx playwright show-report
```

---

## File Relationships

```
playwright/
├── constants.ts              (Test Data)
├── fixtures.ts              (Helper Functions)
├── specs/
│   ├── home.spec.ts         (Auth Tests)
│   └── dishes.spec.ts       (Recipe Tests)
├── pom/
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── RegisterPage.ts      (NEW)
│   ├── DishesPage.ts
│   ├── NewDishForm.ts
│   ├── EditDishForm.ts
│   └── ViewDishPage.ts      (NEW)
└── TEST_DOCUMENTATION.md    (Complete Docs)
```

---

## How to Use This Index

1. **For Running Tests:** See "Quick Commands" section
2. **For Understanding Tests:** Read [TEST_DOCUMENTATION.md](playwright/TEST_DOCUMENTATION.md)
3. **For Quick Start:** See [PLAYWRIGHT_TESTS_README.md](PLAYWRIGHT_TESTS_README.md)
4. **For Execution:** Follow [TEST_EXECUTION_CHECKLIST.md](TEST_EXECUTION_CHECKLIST.md)
5. **For Modification:** Refer to specific POM file links

---

## Recent Changes (Version 1.0)

### New Files Created
- RegisterPage.ts - Registration form handling
- ViewDishPage.ts - Recipe detail view
- TEST_DOCUMENTATION.md - Comprehensive documentation
- TEST_CASE_CREATION_SUMMARY.md - Project summary
- PLAYWRIGHT_TESTS_README.md - Quick start guide
- TEST_EXECUTION_CHECKLIST.md - Execution checklist

### Files Modified
- home.spec.ts - Enhanced from 3 to 21 tests
- dishes.spec.ts - Enhanced from 5 to 29 tests
- constants.ts - Added comprehensive test data
- fixtures.ts - Added helper functions

---

## Maintenance Notes

### Adding New Tests
1. Determine which spec file (home.spec.ts or dishes.spec.ts)
2. Add to appropriate describe block
3. Use existing POM methods or create new ones
4. Update test count in documentation

### Modifying Selectors
1. Update selector in POM file
2. Test methods automatically updated
3. No need to change individual tests

### Adding Test Data
1. Add to `TEST_DATA` in constants.ts
2. Use in relevant tests
3. Update TEST_DOCUMENTATION.md

---

**Last Updated:** January 13, 2026  
**Framework Version:** Playwright 1.57.0  
**Node Version:** 18+ required

