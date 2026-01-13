# Test Execution Checklist

## Pre-Execution Checklist

### Environment Setup
- [ ] Node.js installed (v18+)
- [ ] npm dependencies installed (`npm install`)
- [ ] Port 3001 is available or `BASE_URL` is updated
- [ ] Database is seeded (`npm run seed` if needed)
- [ ] Test user exists (test@nutriapp.com)

### Application Setup
- [ ] Development server running (`npm run dev`)
- [ ] Server accessible at http://localhost:3001
- [ ] No console errors on application startup
- [ ] Database migrations completed

## Test Execution

### Running All Tests
```bash
npx playwright test
```
**Expected Result:** 50/50 tests passing ✓

### Running by Category

#### Authentication Tests (21 tests)
```bash
npx playwright test playwright/specs/home.spec.ts
```
**Expected:** 21/21 passing ✓

#### Recipe Management Tests (29 tests)
```bash
npx playwright test playwright/specs/dishes.spec.ts
```
**Expected:** 29/29 passing ✓

### Test Groupings & Execution

#### Home/Authentication Tests
- [ ] Landing Page (4 tests)
  - [ ] Landing page greeting displays
  - [ ] Test credentials visible
  - [ ] Can navigate to login
  - [ ] Can navigate to registration

- [ ] Login Functionality (6 tests)
  - [ ] Login form displays
  - [ ] Valid login redirects to dishes
  - [ ] Valid credentials work
  - [ ] Invalid password rejected
  - [ ] Invalid email rejected
  - [ ] Can navigate to registration

- [ ] Registration Functionality (4 tests)
  - [ ] Registration form displays
  - [ ] Can navigate to login
  - [ ] Valid registration creates account
  - [ ] Form accepts all required fields

- [ ] Session Management (4 tests)
  - [ ] Authenticated user can access dishes
  - [ ] Logout button visible when logged in
  - [ ] Can logout successfully
  - [ ] Unauthenticated cannot access dishes

- [ ] Navigation (3 tests)
  - [ ] Header displays logo
  - [ ] Navigation shows links when authenticated
  - [ ] Can navigate between pages

#### Dishes/Recipe Tests
- [ ] Dishes List / Read Operations (5 tests)
  - [ ] View dishes list after login
  - [ ] Dishes list displays multiple items
  - [ ] Each card shows required elements
  - [ ] Can view dish details by clicking Ver
  - [ ] Add dish button visible

- [ ] Create Operations (6 tests)
  - [ ] Can navigate to add form
  - [ ] Form displays all fields
  - [ ] Can create dish with all fields
  - [ ] Can create minimal dish
  - [ ] Can add multiple steps
  - [ ] Quick prep checkbox exists

- [ ] Update Operations (8 tests)
  - [ ] Can navigate to edit form
  - [ ] Can edit existing dish
  - [ ] Can update name
  - [ ] Can update description
  - [ ] Can update calories
  - [ ] Edit form shows current data
  - [ ] Can add steps while editing
  - [ ] Can remove steps while editing

- [ ] Delete Operations (3 tests)
  - [ ] Delete button visible
  - [ ] Can delete dish
  - [ ] Dish removed from list

- [ ] View Dish Details (4 tests)
  - [ ] Can view dish details
  - [ ] View page displays steps
  - [ ] View page shows all information
  - [ ] Can navigate back to list

- [ ] Form Validation (3 tests)
  - [ ] Form accepts valid numeric values
  - [ ] Form handles empty calories field
  - [ ] Image URL field accepts valid URLs

## Test Results Documentation

### Execution Summary
Date: _____________
Tester: _____________
Environment: http://localhost:3001
Browser: Chromium (Playwright default)

### Results
- [ ] Total Tests Run: 50
- [ ] Passed: ___/50
- [ ] Failed: ___/50
- [ ] Skipped: ___/50
- [ ] Execution Time: _____ minutes

### Pass/Fail Details
| Test Suite | Passed | Failed | Total | Status |
|-----------|--------|--------|-------|--------|
| Home/Auth | __/21 | __ | 21 | [ ] ✓ / [ ] ✗ |
| Dishes | __/29 | __ | 29 | [ ] ✓ / [ ] ✗ |
| **TOTAL** | **__/50** | **__** | **50** | **[ ] ✓ / [ ] ✗** |

## Specific Test Execution

### Test 1: Landing Page Shows Greeting
```
File: playwright/specs/home.spec.ts
Test: landing page shows greeting and login link
Steps:
  1. Navigate to http://localhost:3001
  2. Verify heading "Welcome to NutriApp!" visible
  3. Verify login link visible
Expected: ✓ Page loads with greeting and link
Actual: [ ] Pass [ ] Fail
```

### Test 2: Login with Valid Credentials
```
File: playwright/specs/home.spec.ts
Test: login with correct credentials shows dishes page
Steps:
  1. Navigate to login page
  2. Enter test@nutriapp.com
  3. Enter nutriapp123
  4. Click submit
  5. Verify redirected to dishes page
Expected: ✓ Redirected to dishes, list displays
Actual: [ ] Pass [ ] Fail
```

### Test 3: Create New Dish
```
File: playwright/specs/dishes.spec.ts
Test: can create a new dish with all fields
Steps:
  1. Login with test user
  2. Navigate to recipes
  3. Click "Agregar Platillo"
  4. Fill in all form fields
  5. Add preparation steps
  6. Click "Guardar"
  7. Verify redirected to recipes list
  8. Verify new dish appears in list
Expected: ✓ Dish created and visible in list
Actual: [ ] Pass [ ] Fail
```

### Test 4: Edit Existing Dish
```
File: playwright/specs/dishes.spec.ts
Test: can edit an existing dish
Steps:
  1. Login with test user
  2. Navigate to recipes
  3. Click "Editar" on first recipe
  4. Modify calories field
  5. Click "Guardar"
  6. Verify redirected to recipes list
Expected: ✓ Changes saved and reflected
Actual: [ ] Pass [ ] Fail
```

### Test 5: Delete Dish
```
File: playwright/specs/dishes.spec.ts
Test: can delete a dish
Steps:
  1. Login with test user
  2. Navigate to recipes
  3. Count delete buttons
  4. Click "Eliminar" on first recipe
  5. Wait for update
  6. Count delete buttons again
Expected: ✓ Count decreased by 1
Actual: [ ] Pass [ ] Fail
```

### Test 6: View Recipe Details
```
File: playwright/specs/dishes.spec.ts
Test: can view dish details on view page
Steps:
  1. Login with test user
  2. Navigate to recipes
  3. Click "Ver" on first recipe
  4. Wait for page to load
  5. Verify recipe name visible
  6. Verify preparation steps visible
Expected: ✓ Details page loads with all info
Actual: [ ] Pass [ ] Fail
```

### Test 7: Register New User
```
File: playwright/specs/home.spec.ts
Test: registration with valid data creates account
Steps:
  1. Navigate to register page
  2. Fill in all fields
  3. Submit form
  4. Verify redirect or success
Expected: ✓ Account created successfully
Actual: [ ] Pass [ ] Fail
```

## Troubleshooting

### If Tests Fail

#### Port Already in Use
```
Error: Port 3000 is in use
Solution: 
  - Update BASE_URL to http://localhost:3001 in constants.ts
  - OR kill process using port 3000
  - OR start server on different port with npm run dev -- -p 3002
```

#### Tests Timeout
```
Error: Timeout waiting for locator
Solution:
  - Increase timeout in specific test
  - Verify selectors haven't changed
  - Check if app is running
  - Check browser console for errors
```

#### Authentication Fails
```
Error: Login fails with valid credentials
Solution:
  - Verify test user exists in database
  - Run: npm run seed
  - Check if password has changed
  - Verify database is accessible
```

#### Element Not Found
```
Error: Locator not found
Solution:
  - Verify element selectors in POM
  - Check if app UI has changed
  - Verify element is not hidden/invisible
  - Add wait condition if element loads dynamically
```

## Performance Metrics

### Expected Execution Times
- Per test: 2-4 seconds
- Total suite: 3-5 minutes
- Fast tests: Login, navigation (1-2 sec)
- Slow tests: Create with multiple steps (5-8 sec)

## Post-Execution

### Generate Reports
```bash
# HTML Report
npx playwright show-report

# JSON Report
npx playwright test --reporter=json > test-results.json

# List all tests
npx playwright test --list
```

### Archive Results
- [ ] Save test logs
- [ ] Save screenshots (if any failures)
- [ ] Save videos (if configured)
- [ ] Document any issues found
- [ ] Update regression list

## Sign-Off

**Test Execution Date:** _____________

**Executed By:** _____________

**All Tests Passed:** [ ] Yes [ ] No

**Issues Found:** _________________________

**Sign-Off:** _____________

**Approval:** _____________

---

## Notes
- Tests are independent and can be run in any order
- Tests clean up after themselves
- No manual database cleanup needed
- Each test is self-contained

---

## Version Control
- **Test Suite Version:** 1.0
- **Last Updated:** January 13, 2026
- **Created By:** E2E Test Automation Team
- **Framework:** Playwright v1.57.0

