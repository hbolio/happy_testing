Exploration of http://localhost:3000/

Summary:
- Title: Create Next App
- Main heading: "Welcome to NutriApp!"
- Navigation links found: `/dishes`, `/login`
- Visible test user credentials on landing page: `test@nutriapp.com` / `nutriapp123`
- Logout button present (likely shown when authenticated)
- Main CTA: link to `/login`

Key elements and recommended selectors:
- Main heading: `main h1` or `text=Welcome to NutriApp!`
- Link to dishes: `a[href="/dishes"]` or `text=Recetas`
- Login link: `a[href="/login"]` or `text=Go to Login`
- Logout button: `button:has-text("Logout")`

Suggested test cases:
1. Landing page loads and shows greeting and login link.
2. Navigate to `/login` and display login form.
3. Login with seeded user (`test@nutriapp.com` / `nutriapp123`) redirects to `/dishes`.
4. Create a new dish flow (navigate `/dishes/new`).
5. Edit and delete dish flows for an existing dish.

Notes:
- The app exposes the test credentials on the landing page which simplifies e2e login tests.
