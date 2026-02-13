# Habit Tracker Frontend

Frontend for the Habit Tracker app using Next.js App Router, Tailwind CSS, Axios, and Redux Toolkit.

## Tech Stack

- Next.js `16.1.6`
- React `19.2.3`
- TypeScript
- Tailwind CSS `4.1.18`
- PostCSS (`@tailwindcss/postcss`)
- Redux Toolkit (`@reduxjs/toolkit`)
- React Redux (`react-redux`)
- Axios
- ESLint

## Install and Run

Run inside `habit-frontend`:

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Tailwind Setup

Tailwind is enabled with:

- `postcss.config.js`
- `app/globals.css`
- `app/layout.tsx`

`app/globals.css`:

```css
@import "tailwindcss";
```

## Current Structure

```text
app/
  layout.tsx
  providers.tsx
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
  habitSlice.ts
```

## API Layer

### `lib/axios.ts`

Shared axios instance:

- `baseURL: "http://localhost:5000/"`
- `withCredentials: true`

### `lib/apiRoutes.ts`

Centralized endpoint constants/functions:

- `API.AUTH.LOGIN`
- `API.AUTH.REGISTER`
- `API.AUTH.ME`
- `API.AUTH.LOGOUT`
- `API.HABITS.CREATE`
- `API.HABITS.GET_ALL`
- `API.HABITS.COMPLETE(id)`
- `API.HABITS.STATS(id)`

Why this is useful:

- No repeated endpoint strings.
- Safer refactoring.
- Cleaner API calls.

## Redux Store and Slices

### What the Store Does

File: `store/index.ts`

```ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
  },
});
```

Store is the single global state container. Every component gets shared state from here through the React Redux `Provider`.

### Provider Wiring

- `app/providers.tsx` wraps app with `<Provider store={store}>`.
- `app/layout.tsx` renders `<Providers>{children}</Providers>`.

Without this, hooks like `useDispatch()`/`useSelector()` throw context errors.

### `authSlice` (`store/authSlice.ts`)

Purpose: manage authentication state globally.

State:

- `user`
- `isAuthenticated`

Actions:

- `setUser(payload)`
  - Save logged-in user and mark authenticated.
- `logout()`
  - Clear user and auth flag.

Where used now:

- Login page dispatches `setUser(res.data.user)` after successful login.
- Register page dispatches `setUser(res.data.user)` after successful register response.

### `habitSlice` (`store/habitSlice.ts`)

Purpose: manage habits list in global state.

State:

- `list: Habit[]`

Actions:

- `setHabits(payload: Habit[])`
  - Replace full habits list (use after fetching habits).
- `addHabit(payload: Habit)`
  - Push one new habit (use after create habit API success).

Why this slice is useful:

- One source of truth for habits.
- UI updates in all components using the same state.
- Easier predictable updates with reducer actions.

## Why `"use client"` Is Needed

`app/auth/login/page.tsx` and `app/auth/register/page.tsx` are client components because they use:

- `useState`
- `useDispatch`
- `useRouter`
- event handlers (`onChange`, `onClick`)

These features do not run in Server Components.

## Current Auth Flow

### Login (`app/auth/login/page.tsx`)

1. User enters email/password.
2. `api.post(API.AUTH.LOGIN, { email, password })`
3. On success:
   - `dispatch(setUser(res.data.user))`
   - `router.push("/dashboard")`
4. On failure: show error message.

### Register (`app/auth/register/page.tsx`)

1. User enters name/email/password.
2. `api.post(API.AUTH.REGISTER, formData)`
3. On success:
   - `dispatch(setUser(res.data.user))`
   - `router.push("/auth/login")`
4. On failure: show error message.

## Notes

- Home page currently links to `/login` and `/signup`, but implemented routes are `/auth/login` and `/auth/register`.
- Recommended fix: update links in `app/page.tsx` to match existing routes.
