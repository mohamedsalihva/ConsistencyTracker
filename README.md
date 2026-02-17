# Habit Tracker SaaS (Production Blueprint)

A full-stack Habit / Consistency Tracker SaaS with colorful animated analytics, JWT cookie auth, streak logic, and a modular production architecture.

This README is the implementation contract for the system.

## 1. Product Scope

Users can:

- Sign up / login
- Create up to 5 habits
- Mark habits complete daily
- Maintain streaks
- View a 35-day consistency matrix
- View daily activity bars
- View weekly strip
- View KPI cards
- View completion rings
- View top habits ranking
- Use animated dashboard UI
- Use mobile FAB (+) for quick add
- See toast notifications
- See confetti on completion

## 2. Tech Stack

### Frontend

- Next.js 14 App Router
- React + TypeScript
- Tailwind CSS
- Redux Toolkit
- Axios
- Framer Motion
- Lucide Icons

### Backend

- NestJS
- MongoDB Atlas
- Mongoose
- Passport JWT
- bcrypt

### Auth

- JWT stored in HTTP-only cookies
- No localStorage token auth

## 3. Monorepo Structure

```text
habit-tracker/
  backend/
    src/
      modules/
        auth/
        users/
        habits/
      main.ts
    .env
    package.json
  habit-frontend/
    src/
      app/
        dashboard/page.tsx
        auth/login/page.tsx
      components/
        dashboard/
          Hero.tsx
          Matrix.tsx
          DailyChart.tsx
          KpiGrid.tsx
          RingSection.tsx
          TopHabits.tsx
          WeekStrip.tsx
          CreateHabitModal.tsx
      hooks/
        useDashboard.ts
      store/
        habitSlice.ts
      lib/
        api.ts
        axios.ts
      utils/
        analytics.ts
        date.ts
        theme.ts
    .env.local
    package.json
```

Note:

- In your current repo, dashboard files may live under `habit-frontend/app/dashboard/*`.
- Keep module boundaries strict even if paths differ slightly.

## 4. Backend Architecture (NestJS)

### Modules

- `src/modules/auth`
- `src/modules/users`
- `src/modules/habits`

### Habit Schema

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  history: [{ date: "YYYY-MM-DD", completed: boolean }],
  streak: number,
  createdAt: Date,
  updatedAt: Date
}
```

### API Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /habits`
- `GET /habits`
- `POST /habits/complete/:id`

### Business Rules

- Max 5 habits per user
- Only one completion per habit per day
- On completion:
  - add today history entry
  - if yesterday completed => streak +1
  - if yesterday missed => streak = 1
- Habit not found / unauthorized habit => 404
- Duplicate same-day completion => 400

## 5. JWT Cookie Auth (Required)

### Register/Login flow

1. Validate payload
2. Hash password (register) with bcrypt
3. Create/verify user
4. Sign JWT
5. Set HTTP-only cookie in response

### Cookie settings (prod)

- `httpOnly: true`
- `secure: true` (production HTTPS)
- `sameSite: "none"` for cross-domain FE/BE deployments (or `"lax"` for same-site)
- `path: "/"`
- reasonable maxAge/expiry

Frontend must send credentials:

```ts
axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
```

## 6. Frontend Architecture

### Redux (`habits.list[]`)

`habitSlice` actions:

- `setHabits`
- `addHabit`
- `updateHabit`

### `useDashboard` Hook Responsibilities

- fetch habits
- create habits (1..remaining slots)
- complete habit
- hold modal state
- hold chart mode state
- compute and expose dashboard analytics data
- expose handler props for all UI components

Rule:

- Keep business/data orchestration in hook.
- Keep rendering and interactions in components.

### Analytics Pure Function

`buildDashboardView(habits, chartMode)` returns:

- `todayPct`
- `weekPct`
- `monthPct`
- `allPct`
- `chartData`
- `last35`
- `last7`
- `topHabits`
- `completionMap`
- `maxStreak`
- `activeDays`

No side effects. Pure deterministic function.

## 7. Dashboard Components

Required components:

- `Hero`
- `Matrix`
- `DailyChart`
- `KpiGrid`
- `RingSection`
- `TopHabits`
- `WeekStrip`
- `CreateHabitModal`

UI behavior requirements:

- pastel gradients
- glass cards
- hover lifts
- animated bars/rings
- matrix click on today cell => complete habit
- completion confetti pop
- floating + FAB on mobile
- toast feedback for success/error
- streak emoji indicators

## 8. Promise / Data Flow

### Initial load

1. User logs in
2. Backend sets JWT cookie
3. Frontend routes to dashboard
4. `useDashboard` calls `GET /habits`
5. `setHabits` in Redux
6. `buildDashboardView` computes derived metrics
7. Components render

### Create habit

1. Open modal
2. Enter 1..N titles
3. Validate non-empty + slot count
4. `POST /habits` for each title
5. `addHabit` dispatch for each created habit
6. UI auto refreshes

### Complete habit

1. Click today matrix cell
2. Trigger confetti animation locally
3. `POST /habits/complete/:id`
4. Receive updated habit from backend
5. `updateHabit` dispatch
6. KPIs/charts/matrix/ranks re-render from same store source

## 9. Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/habit-tracker
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (`habit-frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 10. API Contract Examples

### Register

`POST /auth/register`

```json
{ "name": "Salih", "email": "salih@mail.com", "password": "StrongPass123!" }
```

### Login

`POST /auth/login`

```json
{ "email": "salih@mail.com", "password": "StrongPass123!" }
```

### Create Habit

`POST /habits`

```json
{ "title": "Read 20 pages" }
```

### Complete Habit

`POST /habits/complete/:id`

Response returns updated habit:

```json
{
  "_id": "habitId",
  "title": "Read 20 pages",
  "streak": 4,
  "history": [{ "date": "2026-02-17", "completed": true }]
}
```

## 11. Tailwind + UI Notes

- Keep design tokens centralized in `globals.css` + optional `tailwind.config`.
- Reuse utility classes like:
  - `glass-card`
  - `chip`, `chip-active`, `chip-inactive`
  - `btn-cta`
  - `gradient-text`

This keeps components maintainable while preserving visual consistency.

## 12. Deployment Notes

### Backend

- Deploy on Render/Railway/Fly.io
- Use managed MongoDB Atlas
- Set CORS with exact frontend origin
- Set secure cookie options in production

### Frontend

- Deploy on Vercel
- `NEXT_PUBLIC_API_URL` -> deployed backend URL
- Ensure backend CORS + cookie policy allow frontend domain

### Cross-domain cookie checklist

- HTTPS on both frontend/backend
- `sameSite: "none"` + `secure: true` on backend cookie
- `withCredentials: true` in axios

## 13. Run Locally

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd habit-frontend
npm install
npm run dev
```

## 14. Acceptance Checklist

- [ ] User can register/login with HTTP-only cookie auth
- [ ] No localStorage token auth
- [ ] User cannot exceed 5 habits
- [ ] One completion per habit per day enforced
- [ ] Streak increments/resets correctly
- [ ] Dashboard renders all required analytics sections
- [ ] Matrix today cell click completes habit
- [ ] Confetti + toasts visible on completion
- [ ] Mobile FAB visible and functional
- [ ] No mock data in production path

