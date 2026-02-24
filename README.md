# Habit Tracker (Learning + Production-Style Monorepo)

Full-stack habit tracker built with NestJS + Next.js.
This README reflects the current implementation in this repository.

## What Is Implemented So Far

- Auth with JWT cookie flow (backend + frontend credentials flow).
- Frontend route protection with Next.js middleware:
  - unauthenticated users are redirected from `/dashboard` to `/auth/login`
  - authenticated users are redirected away from `/auth/login` and `/auth/register` to `/dashboard`
- Habit CRUD core:
  - Create habit
  - Get all habits
  - Mark habit complete for today
  - Check-in toggle for today or yesterday
  - Rename habit
  - Delete habit
- Habit creation limit: `15` habits per user.
- Duplicate title guard on rename (case-insensitive, per user).
- Dashboard analytics UI:
  - 35-day matrix
  - daily chart
  - KPI cards
  - ring summaries
  - week strip
  - top habits ranking
- Top habits card supports internal scrolling without pushing layout.
- Frontend state via Redux Toolkit (`auth`, `habits`, `chat`).
- AI Habit Coach chatbot:
  - JWT-protected backend route `POST /ai/chat`
  - Gemini provider integration (`@google/genai`)
  - AI is grounded with real habit data from MongoDB (per user)
  - backend builds context (pending today, missed yesterday, weak habits, progress %)
  - floating chat widget on dashboard
  - frontend anti-spam guard (loading lock + cooldown on `429`)
  - sends only last 20 messages per request
  - response style constrained to plain text in 3 lines (Insight / Action today / Follow-up)
- Backend throttling via `@nestjs/throttler` (`3` requests per `60` seconds globally).

## Tech Stack

### Backend

- NestJS
- Mongoose + MongoDB
- Passport JWT
- class-validator + class-transformer
- @google/genai (Gemini API)
- @nestjs/throttler

### Frontend

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Redux Toolkit + React Redux
- Axios
- Framer Motion
- Lucide icons

## Monorepo Structure

```text
habit-tracker/
  backend/
    src/
      auth/
      users/
      habits/
        dto/
        habit.schema.ts
        habits.controller.ts
        habits.service.ts
      ai/
        dto/
          chat.dto.ts
        ai.controller.ts
        ai.service.ts
        ai.module.ts
      app.module.ts
      main.ts
    package.json
  habit-frontend/
    middleware.ts
    app/
      auth/
        login/
          page.tsx
        register/
          page.tsx
      dashboard/
        components/
          CoachChat.tsx
        hooks/
        utils/
        page.tsx
    lib/
      apiRoutes.ts
      axios.ts
    store/
      authSlice.ts
      habitSlice.ts
      chatSlice.ts
      index.ts
    package.json
  README.md
```

## API Endpoints (Current)

Auth:

- `POST /auth/register` -> create user
- `POST /auth/login` -> validate user and set `token` HTTP-only cookie
- `GET /auth/me` -> get current logged-in user (JWT required)
- `POST /auth/logout` -> clear auth cookie

Base: `/habits` (JWT guard protected)

- `POST /habits` -> create habit
- `GET /habits` -> get all current user habits
- `POST /habits/complete/:id` -> mark today complete
- `PATCH /habits/:id/checkin` -> toggle check-in for a specific date (`today`/`yesterday`)
- `PATCH /habits/:id` -> rename habit title
- `DELETE /habits/:id` -> delete habit

Base: `/ai` (JWT guard protected)

- `POST /ai/chat` -> chat with AI Habit Coach

## Backend Business Rules

- Max habits per user: `15`
- Complete only once per day for one habit
- Streak logic:
  - if yesterday completed -> streak + 1
  - otherwise -> streak = 1
- Rename guard:
  - reject if another habit for same user has same title (case-insensitive)
- Date check-in guard:
  - user can edit only `today` or `yesterday`
- All `/habits` and `/ai/chat` endpoints require valid JWT (`AuthGuard('jwt')`)
- AI chat DTO guards:
  - `messages` array required (`1..20`)
  - message `role` must be `user` or `assistant`
  - message `content` max `2000`
  - optional `context` max `1000`
- Gemini provider quota/rate-limit errors are surfaced as `429` for frontend handling.
- AI context is built server-side from user habits in MongoDB before calling Gemini.

## Auth and Route Protection Flow

### Server/API protection (required)

- Backend protects habit and AI routes with `@UseGuards(AuthGuard('jwt'))`.
- If user is not logged in, protected API requests return `401 Unauthorized`.

### Frontend route protection (UX + access control)

- `habit-frontend/middleware.ts` checks `token` cookie on route entry.
- `/dashboard` without token -> redirect to `/auth/login?next=/dashboard`.
- `/auth/login` or `/auth/register` with token -> redirect to `/dashboard`.

### Dashboard runtime fallback

- `useDashboard` handles `401` responses from habit actions.
- On `401`, user is redirected to `/auth/login`.

### Post-login redirect

- Login page reads `next` query param.
- After successful login:
  - if `next` exists and starts with `/`, redirect there
  - otherwise redirect to `/dashboard`

## Frontend Data Flow (End to End)

### 1) Load dashboard

1. Dashboard mounts.
2. `useDashboard` calls `GET /habits`.
3. Result dispatches `setHabits`.
4. `buildDashboardView(...)` derives analytics.
5. Components render from Redux store.

### 2) Create habit

1. Open `CreateHabitModal`.
2. Validate titles and remaining slots.
3. Call `POST /habits` for each title.
4. Dispatch `addHabit` for each created item.
5. Analytics/UI refresh.

### 3) Complete / check-in / rename / delete

1. User action in matrix.
2. Frontend calls corresponding habit endpoint.
3. Dispatches `updateHabit` or `removeHabit`.
4. UI + analytics recalculate.

### 4) AI coach chat

1. User opens floating `CoachChat` widget.
2. User message is pushed to Redux `chatSlice`.
3. Frontend posts to `POST /ai/chat` with `messages` + optional context.
4. Backend fetches user habits from MongoDB and builds AI context.
5. Backend sends grounded prompt to Gemini and returns `{ reply }`.
6. Frontend appends assistant message.
7. On `429`, frontend enters temporary cooldown.

## Key Functions by Layer

### Backend service functions

- Habit service:
  - `createHabit(userId, title)`
  - `getHabits(userId)`
  - `markComplete(habitId, userId)`
  - `checkinHabit(habitId, userId, date, completed)`
  - `renameHabit(habitId, userId, title)`
  - `deleteHabit(habitId, userId)`
- AI service:
  - `chat(userId, messages, context?)`
  - internal context builder from DB (`buildHabitContext`)

### Frontend hook/functions

- `useDashboard`:
  - `handleCreateHabit(...)`
  - `completeToday(habitId)`
  - `toggleCheckin(habitId, date, completed)`
  - `renameHabit(habitId, title)`
  - `deleteHabit(habitId)`
- `CoachChat`:
  - sends chat request
  - handles `loading`, `error`, `429` cooldown

### Redux reducers

`habitSlice`

- `setHabits`
- `addHabit`
- `updateHabit`
- `removeHabit`

`chatSlice`

- `addMessage`
- `setLoading`
- `setChatError`
- `clearChat`

## Run Commands

## Backend

```bash
cd backend
npm install
npm run dev
```

Useful backend commands:

```bash
npm run build
npm run test
npm run test:watch
npm run lint
```

## Frontend

```bash
cd habit-frontend
npm install
npm run dev
```

Useful frontend commands:

```bash
npm run build
npm run lint
```

<<<<<<< HEAD
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



## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=...
JWT_SECRET=...
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=development
```

### Frontend (`habit-frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
 e6ad8f7 (schem afor worksapce added)

Note: current `habit-frontend/lib/axios.ts` uses a hardcoded base URL (`http://localhost:5000/`).

## Current Notes / Cleanup

- DTO class is currently named `updateHabitDto`; preferred TypeScript convention is `UpdateHabitDto`.
- Add/expand tests for rename/delete and duplicate checks.
- Optionally add duplicate-title guard to `createHabit` as well (rename already guarded).
- AI is currently stateless per request (no persistent chat history in DB yet).
- Consider persistent chat history in MongoDB for long-term AI conversations.
- Keep API keys secret and rotate immediately if exposed.


