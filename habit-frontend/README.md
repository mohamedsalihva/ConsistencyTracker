# Habit Tracker Frontend

This frontend is built with Next.js App Router, Tailwind CSS, Redux Toolkit, React Redux, and Axios.

## 1. Tech Stack Installed

- Next.js `16.1.6`
- React `19.2.3`
- TypeScript
- Tailwind CSS `4.1.18`
- PostCSS + `@tailwindcss/postcss`
- Redux Toolkit `@reduxjs/toolkit`
- React Redux `react-redux`
- Axios
- ESLint

## 2. Installation and Setup Commands

Run these inside `habit-frontend`:

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run dev      # start development server
npm run build    # production build
npm run start    # run production server
npm run lint     # run lint checks
```

## 3. Tailwind Configuration

Tailwind is enabled using these files:

- `postcss.config.js`
- `app/globals.css`
- `app/layout.tsx`

### `postcss.config.js`

```js
module.exports = { plugins: { "@tailwindcss/postcss": {} } };
```

### `app/globals.css`

```css
@import "tailwindcss";
```

### `app/layout.tsx`

Global CSS is imported in layout:

```tsx
import "./globals.css";
```

## 4. Project Structure (Current)

```text
app/
  layout.tsx
  page.tsx
  globals.css
  auth/
    login/page.tsx
    register/page.tsx
lib/
  axios.ts
  apiRoutes.ts
store/
  index.ts
  authSlice.ts
```

## 5. Frontend Routes and Pages

- `app/page.tsx`
  - Home page with Login and Signup buttons.
- `app/auth/login/page.tsx`
  - Client component with login form and API call.
- `app/auth/register/page.tsx`
  - Currently empty and should be implemented with a default exported component.

## 6. API Layer

### `lib/axios.ts`

Creates one Axios instance:

- `baseURL: "http://localhost:8080/api"`
- `withCredentials: true` to send cookies/session data.

### `lib/apiRoutes.ts`

Keeps endpoint paths centralized:

- `API.AUTH.LOGIN`
- `API.AUTH.REGISTER`
- `API.AUTH.ME`
- `API.AUTH.LOGOUT`
- `API.HABITS.CREATE`
- `API.HABITS.GET_ALL`
- `API.HABITS.COMPLETE(id)`
- `API.HABITS.STATS(id)`

Why this is useful:

- Avoids hardcoded strings in multiple files.
- Makes API path changes easier and safer.

## 7. Redux Toolkit Setup

### `store/authSlice.ts`

State:

- `user`
- `isAuthenticated`

Reducers:

- `setUser(state, action)`
  - Saves logged-in user and sets `isAuthenticated = true`.
- `logout(state)`
  - Clears user and sets `isAuthenticated = false`.

### `store/index.ts`

Creates global Redux store using `configureStore` with `auth` reducer.

## 8. Login Flow (How It Works)

In `app/auth/login/page.tsx`:

1. User enters email/password (`useState`).
2. `handleLogin` sends `POST` request:
   - `api.post(API.AUTH.LOGIN, { email, password })`
3. On success:
   - `dispatch(setUser(res.data.user))`
   - `router.push("/dashboard")`
4. On failure:
   - Shows `Invalid email or password`.

## 9. Why `"use client"` Is Required

`app/auth/login/page.tsx` starts with:

```tsx
"use client";
```

This is required because the page uses client-only features:

- `useState`
- `useDispatch`
- `useRouter`
- click handlers (`onClick`)

Without `"use client"`, Next.js treats the file as a Server Component and these hooks/events will fail.

## 10. Why We Use `dispatch` (Redux Toolkit)

`dispatch` is used to send actions to the Redux store.

Example in login page:

```tsx
dispatch(setUser(res.data.user));
```

Why this is important:

- Stores auth state globally.
- Any page/component can read login status/user data.
- Avoids prop drilling.
- Keeps auth logic predictable and centralized.

## 11. Important Notes / Current Gaps

- `app/auth/register/page.tsx` is empty and should be implemented.
- Home page links currently point to `/login` and `/signup`, but existing auth routes are under `/auth/...`.
  - Update links to `/auth/login` and `/auth/register` (or create matching routes).
- If Redux `Provider` is not added in layout via a client wrapper, Redux hooks will fail at runtime.

## 12. Next Recommended Steps

1. Create a `Providers` component and wrap app with `<Provider store={store}>`.
2. Implement `register/page.tsx`.
3. Fix route links on home page.
4. Add protected route handling for dashboard.
5. Add logout and auth persistence (`/auth/me` check on app load).
