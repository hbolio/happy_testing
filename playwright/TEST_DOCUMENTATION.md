# NutriApp - End-to-End Test Documentation

## Project Overview

**Application Name:** NutriApp (Nutrient Recipe App)  
**Technology Stack:** Next.js 15, React 19, Prisma ORM, TailwindCSS  
**Database:** SQLite/PostgreSQL (via Prisma)  
**Testing Framework:** Playwright

---

## Application Features

### 1. Authentication System
- **User Registration:** New users can create accounts with personal information
- **User Login:** Secure login with email and password
- **Session Management:** Logout functionality to end sessions
- **Seeded Test User:** 
  - Email: `test@nutriapp.com`
  - Password: `nutriapp123`

### 2. User Registration Form
Fields collected during registration:
- First Name (required)
- Last Name (required)
- Email (required, must be unique)
- Nationality (required)
- Phone/Celular (required)
- Password (required)

### 3. Recipe (Dishes) Management
The application is built around managing healthy recipes with the following CRUD operations:

#### Create
- Users can add new dishes/recipes
- Form fields include:
  - **Name** (required): Recipe name
  - **Description** (required): Recipe details and ingredients
  - **Preparation Time** (numeric in minutes)
  - **Cooking Time** (numeric in minutes)
  - **Calories** (numeric, total calories)
  - **Image URL** (optional, for recipe image)
  - **Steps** (dynamic array): Multiple preparation steps
  - **Quick Prep** (checkbox): Flag for quick recipes (< 20 min)

#### Read
- View all recipes on the main dishes page
- Each recipe card displays:
  - Recipe image
  - Recipe name
  - Recipe description
  - Preparation time or "Rápido" (Quick) badge
  - Calorie count (on detail view)
- View recipe details including all steps
- View page displays:
  - Recipe information
  - Preparation steps as numbered list
  - Time and calorie information

#### Update
- Edit existing recipe details
- Update name, description, calories, preparation/cooking time
- Add or remove preparation steps
- Save changes and return to list

#### Delete
- Remove recipes from the list
- Delete button visible on each recipe card
- Immediate removal from list after deletion

### 4. User Interface Navigation
- **Header Navigation:**
  - NutriApp logo and branding
  - Link to "Recetas" (Recipes) page
  - Logout button (when authenticated)
- **Page Routes:**
  - `/` - Landing page (unauthenticated)
  - `/login` - Login form
  - `/register` - Registration form
  - `/dishes` - Recipe list (authenticated)
  - `/dishes/new` - Add new recipe form
  - `/dishes/[id]` - Edit recipe
  - `/dishes/[id]/view` - View recipe details

---

## Test Structure

### Page Object Model (POM) Pattern

#### HomePage.ts
**Purpose:** Handle home/landing page interactions

**Selectors:**
- `heading`: Main h1 element
- `linkDishes`: Link to dishes page
- `linkLogin`: Link to login page
- `logoutButton`: Logout button

**Methods:**
- `goto()`: Navigate to home page
- `clickLogin()`: Click login link
- `clickDishes()`: Click dishes link
- `getHeadingText()`: Get heading text

---

#### LoginPage.ts
**Purpose:** Handle login page interactions

**Selectors:**
- `emailInput`: Email input field
- `passwordInput`: Password input field
- `submitButton`: Login submit button

**Methods:**
- `goto()`: Navigate to login page
- `fillEmail()`: Fill email field
- `fillPassword()`: Fill password field
- `submit()`: Click submit button
- `login()`: Complete login action

---

#### RegisterPage.ts
**Purpose:** Handle registration page interactions

**Selectors:**
- `firstNameInput`: First name input
- `lastNameInput`: Last name input
- `emailInput`: Email input
- `nationalityInput`: Nationality input
- `phoneInput`: Phone input
- `passwordInput`: Password input
- `registerButton`: Submit button
- `loginLink`: Link to login page

**Methods:**
- `goto()`: Navigate to register page
- `fillFirstName()`: Fill first name
- `fillLastName()`: Fill last name
- `fillEmail()`: Fill email
- `fillNationality()`: Fill nationality
- `fillPhone()`: Fill phone
- `fillPassword()`: Fill password
- `submit()`: Click register button
- `register()`: Complete registration
- `clickLoginLink()`: Navigate to login

---

#### DishesPage.ts
**Purpose:** Handle recipes list page interactions

**Selectors:**
- `heading`: "Sugerencias de Platillos" heading
- `addDishLink`: Link to add new recipe
- `dishCard`: Recipe cards
- `deleteButton`: Delete button on cards

**Methods:**
- `goto()`: Navigate to dishes page
- `clickAddDish()`: Navigate to add dish form
- `getFirstDishTitle()`: Get first recipe name
- `clickEditFirstDish()`: Edit first recipe
- `clickDeleteFirstDish()`: Delete first recipe
- `getDeleteButtonsCount()`: Count delete buttons

---

#### NewDishForm.ts
**Purpose:** Handle new recipe creation form

**Selectors:**
- `nameInput`: Recipe name input
- `descriptionInput`: Recipe description textarea
- `prepTimeInput`: Preparation time input
- `cookTimeInput`: Cooking time input
- `caloriesInput`: Calories input
- `imageUrlInput`: Image URL input
- `quickPrepCheckbox`: Quick prep checkbox
- `addStepButton`: Add step button
- `saveButton`: Save button

**Methods:**
- `goto()`: Navigate to new dish page
- `fillName()`: Fill name
- `fillDescription()`: Fill description
- `fillPrepTime()`: Fill prep time
- `fillCookTime()`: Fill cook time
- `fillCalories()`: Fill calories
- `fillImageUrl()`: Fill image URL
- `addStep()`: Add preparation step
- `save()`: Submit form
- `createDish()`: Complete dish creation

---

#### EditDishForm.ts
**Purpose:** Handle recipe editing form

**Selectors:**
- All same as NewDishForm
- Plus: Remove step buttons (×)

**Methods:**
- `gotoEditDish()`: Navigate to specific dish edit page
- `fillName()`: Fill name
- `fillDescription()`: Fill description
- `fillCalories()`: Fill calories
- `save()`: Submit changes
- `updateDish()`: Update specific fields

---

#### ViewDishPage.ts
**Purpose:** Handle recipe detail view page

**Selectors:**
- `heading`: Recipe name heading
- `description`: Recipe description
- `stepsHeading`: "Pasos de preparación" heading
- `stepsList`: List of preparation steps

**Methods:**
- `gotoViewDish()`: Navigate to view page
- `getHeading()`: Get recipe name
- `getDescription()`: Get description
- `getStepsCount()`: Count steps
- `getStepText()`: Get specific step text
- `getAllSteps()`: Get all steps

---

### Test Files

#### home.spec.ts
**Test Suites:**
1. **Landing Page** (4 tests)
   - Display greeting and login link
   - Display test credentials
   - Navigate to login
   - Navigate to registration

2. **Login Functionality** (6 tests)
   - View login form fields
   - Login redirects to dishes
   - Correct credentials work
   - Incorrect password shows error
   - Non-existent email shows error
   - Navigate to registration

3. **Registration Functionality** (4 tests)
   - View registration form fields
   - Navigate to login
   - Registration with valid data
   - Form accepts all fields

4. **Session Management** (4 tests)
   - Authenticated user accesses dishes
   - Logout button visible when logged in
   - Can logout successfully
   - Unauthenticated cannot access dishes

5. **Navigation** (3 tests)
   - Header displays logo
   - Navigation shows links when authenticated
   - Navigate between pages

**Total Home Tests: 21**

---

#### dishes.spec.ts
**Test Suites:**

1. **Dishes List / Read Operations** (4 tests)
   - View dishes list
   - Display multiple dishes
   - Each card shows required elements
   - View button navigates to detail

2. **Create Operations** (6 tests)
   - Navigate to add form
   - Form displays all fields
   - Create dish with all fields
   - Create minimal dish
   - Add multiple steps
   - Quick prep checkbox exists

3. **Update Operations** (8 tests)
   - Navigate to edit form
   - Edit existing dish
   - Update name
   - Update description
   - Update calories
   - Edit form shows current data
   - Add steps while editing
   - Remove steps while editing

4. **Delete Operations** (3 tests)
   - Delete button visible
   - Can delete dish
   - Dish removed from list

5. **View Dish Details** (4 tests)
   - View dish details page
   - View page displays steps
   - View page shows all information
   - Navigate back to list

6. **Form Validation** (3 tests)
   - Valid numeric values accepted
   - Empty calories handled
   - Image URL field accepts valid URLs

**Total Dishes Tests: 28**

---

## Test Data Constants

### TEST_USER (Seeded)
```typescript
{
  email: 'test@nutriapp.com',
  password: 'nutriapp123'
}
```

### TEST_DATA

#### newDish
```typescript
{
  name: 'Test Pasta Carbonara',
  description: 'Authentic Italian pasta with eggs, guanciale, and pecorino cheese',
  prepTime: '5',
  cookTime: '15',
  calories: '450',
  imageUrl: 'https://images.unsplash.com/...',
  steps: ['Cook pasta', 'Fry guanciale', 'Mix eggs', ...]
}
```

#### updatedDish
```typescript
{
  name: 'Updated Pasta Carbonara',
  description: 'Updated description for testing edit functionality',
  calories: '500'
}
```

#### minimalDish
```typescript
{
  name: 'Minimal Test Dish',
  description: 'A minimal test',
  prepTime: '1',
  cookTime: '1',
  calories: '100'
}
```

#### newUser
```typescript
{
  firstName: 'Test',
  lastName: 'User',
  email: `testuser${timestamp}@nutriapp.com`,
  nationality: 'Test Country',
  phone: '+1234567890',
  password: 'TestPassword123!'
}
```

---

## Test Fixtures

### login()
- Navigates to login page
- Logs in with TEST_USER credentials
- Waits for dishes page to load
- Utility for beforeEach in authenticated tests

### logout()
- Clicks logout button
- Waits for redirect to home page

### loginAndGoDishes()
- Combines login() and dishes page navigation

---

## Test Coverage Summary

### Feature Coverage

| Feature | Tests | Status |
|---------|-------|--------|
| Authentication (Login) | 6 | ✓ Complete |
| Registration | 4 | ✓ Complete |
| Session Management | 4 | ✓ Complete |
| Navigation | 7 | ✓ Complete |
| Recipe CRUD (Create) | 6 | ✓ Complete |
| Recipe CRUD (Read) | 8 | ✓ Complete |
| Recipe CRUD (Update) | 8 | ✓ Complete |
| Recipe CRUD (Delete) | 3 | ✓ Complete |
| Recipe Details View | 4 | ✓ Complete |
| Form Validation | 3 | ✓ Complete |
| **TOTAL** | **49** | **✓ Complete** |

---

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test playwright/specs/home.spec.ts
npx playwright test playwright/specs/dishes.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests with UI mode
```bash
npx playwright test --ui
```

### Run specific test
```bash
npx playwright test -g "can create a new dish"
```

### Debug mode
```bash
npx playwright test --debug
```

---

## Key Test Scenarios

### Authentication Flow
1. User navigates to landing page
2. User clicks login link
3. User enters credentials (test@nutriapp.com / nutriapp123)
4. User is redirected to dishes page
5. User sees recipes list

### Create Recipe Flow
1. User logs in
2. User clicks "Agregar Platillo" button
3. User fills in recipe details
4. User adds preparation steps
5. User clicks "Guardar"
6. User is redirected to recipes list
7. New recipe appears in the list

### Edit Recipe Flow
1. User logs in and views recipes
2. User clicks "Editar" on a recipe
3. Form loads with current data
4. User modifies fields (name, calories, description)
5. User adds/removes steps if needed
6. User clicks "Guardar"
7. User is redirected to list with updates

### Delete Recipe Flow
1. User logs in and views recipes
2. User clicks "Eliminar" button
3. Recipe is removed from the list
4. Delete count decreases

### View Recipe Flow
1. User logs in and views recipes
2. User clicks "Ver" on a recipe
3. User sees full recipe details
4. User sees preparation steps as numbered list
5. User can navigate back to list

---

## Best Practices Implemented

### Page Object Model
- ✓ Centralized selectors as constants
- ✓ Reusable page interaction methods
- ✓ Clear separation of concerns

### Test Organization
- ✓ Logical test grouping with `test.describe`
- ✓ Clear test naming describing what is tested
- ✓ Consistent setup with `beforeEach`

### Test Data Management
- ✓ Centralized test constants
- ✓ Timestamp-based unique data generation
- ✓ Meaningful test data structure

### Reliability
- ✓ Proper wait conditions (waitForURL, waitForSelector)
- ✓ Timeouts configured appropriately
- ✓ No hard-coded delays except where necessary

### Maintainability
- ✓ Reusable fixtures for common actions
- ✓ DRY (Don't Repeat Yourself) principle applied
- ✓ Helper methods in Page Objects
- ✓ Clear assertions with meaningful error messages

---

## Known Limitations / Future Improvements

1. **Image Upload Testing:** Currently testing image URL input, not actual file uploads
2. **Error Message Assertions:** Could capture specific error text messages
3. **Accessibility Testing:** Could add accessibility-specific tests (ARIA, keyboard navigation)
4. **Performance Testing:** Could add performance benchmarks
5. **API Testing:** Direct API testing not included (could complement E2E)
6. **Mobile Testing:** Currently desktop-focused, could add mobile/responsive tests
7. **Concurrent Users:** No load/stress testing included

---

## Application URLs

| Page | URL |
|------|-----|
| Landing | http://localhost:3001 |
| Login | http://localhost:3001/login |
| Register | http://localhost:3001/register |
| Dishes List | http://localhost:3001/dishes |
| Add Dish | http://localhost:3001/dishes/new |
| Edit Dish | http://localhost:3001/dishes/[id] |
| View Dish | http://localhost:3001/dishes/[id]/view |

---

## Environment Configuration

- **Base URL:** http://localhost:3001 (configurable via BASE_URL env var)
- **Browser:** Chromium (default Playwright)
- **Viewport:** Default (desktop)

---

## Test Execution Status

- Total Test Cases: **49**
- Test Files: **2** (home.spec.ts, dishes.spec.ts)
- Page Objects: **6** (HomePage, LoginPage, RegisterPage, DishesPage, NewDishForm, EditDishForm, ViewDishPage)
- Fixtures: **3** (login, logout, loginAndGoDishes)

