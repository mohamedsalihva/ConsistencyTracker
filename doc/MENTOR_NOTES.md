# Full-Stack Beginner Notes (Project Mentor Guide)

These notes are written for your current project and beginner learning.

## Frontend

### React
- Definition: React is a library to build UI with reusable components.
- Example:
```tsx
export default function Hello() {
  return <h1>Hello</h1>;
}
```
- Analogy: LEGO blocks for UI.
- In your project: Dashboard, auth pages, and components like `Hero`, `Matrix`, `CoachChat`.

### Next.js (App Router)
- Definition: Framework on top of React. App Router uses folders for routes.
- Example:
```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <div>Dashboard</div>;
}
```
- Analogy: Folder names are street names.
- In your project: `app/auth/login/page.tsx`, `app/dashboard/page.tsx`.

### Components
- Definition: Reusable UI function.
- Example:
```tsx
function Badge({ text }: { text: string }) {
  return <span>{text}</span>;
}
```
- Analogy: Reusable machine part.
- In your project: `CreateHabitModal`, `TopHabits`, `CoachChat`.

### Props
- Definition: Data passed from parent to child.
- Example:
```tsx
<CoachChat context="todayPct=50" />
```
- Analogy: Parent gives instructions to child.
- In your project: `CoachChat` receives `context` from dashboard.

### State (`useState`)
- Definition: Data that changes inside component.
- Example:
```tsx
const [open, setOpen] = useState(false);
```
- Analogy: Sticky note that can be updated.
- In your project: Chat open/close, input value, cooldown timers.

### `useEffect`
- Definition: Runs side effects after render (timers, listeners, API bootstrap).
- Example:
```tsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);
}, []);
```
- Analogy: Setup and cleanup routine.
- In your project: cooldown interval, menu outside-click listeners.

### Controlled Inputs
- Definition: Input value comes from React state.
- Example:
```tsx
<input value={input} onChange={(e) => setInput(e.target.value)} />
```
- Analogy: Steering wheel directly controls direction.
- In your project: chat input and create-habit modal inputs.

### Client Components (`"use client"`)
- Definition: Component runs in browser and can use hooks/events.
- Example:
```tsx
"use client";
import { useState } from "react";
```
- Analogy: Runs on user device.
- In your project: dashboard page, `CoachChat`, modal components.

### SSR vs CSR
- Definition:
  - SSR: Server renders HTML first.
  - CSR: Browser renders with JS.
- Example: App Router pages are server by default; `"use client"` makes component client-rendered.
- Analogy: Pre-cooked meal (SSR) vs cook-at-table (CSR).
- In your project: interactive dashboard/chat is CSR via client components.

### Folder Routing
- Definition: Route path comes from folder path.
- Example:
  - `app/auth/login/page.tsx` -> `/auth/login`
- Analogy: Address from folder structure.
- In your project: auth and dashboard routes.

### JSX
- Definition: HTML-like syntax in JS/TS.
- Example:
```tsx
return <button>Send</button>;
```
- Analogy: Template inside code.
- In your project: all UI files use JSX/TSX.

### Event Handling
- Definition: Functions triggered by user action.
- Example:
```tsx
<button onClick={send}>Send</button>
```
- Analogy: Doorbell triggers handler.
- In your project: submit chat, open modal, logout, toggle check-in.

## Backend

### NestJS
- Definition: Structured backend framework for Node.js.
- Example:
```ts
@Module({ controllers: [AuthController], providers: [AuthService] })
export class AuthModule {}
```
- Analogy: Organized office with departments.
- In your project: `auth`, `habits`, `users`, `ai` modules.

### Controllers
- Definition: Receive HTTP requests and return responses.
- Example:
```ts
@Post('chat')
chat(@Body() dto: ChatDto) {
  return this.aiService.chat(...);
}
```
- Analogy: Reception desk.
- In your project: `auth.controller.ts`, `habits.controller.ts`, `ai.controller.ts`.

### Services
- Definition: Business logic layer.
- Example:
```ts
@Injectable()
export class AiService {
  async chat(...) { ... }
}
```
- Analogy: Worker behind reception.
- In your project: habit logic, auth logic, Gemini call logic.

### DTO
- Definition: Request body shape + validation contract.
- Example:
```ts
export class ChatDto {
  messages: ChatMessageDto[];
  context?: string;
}
```
- Analogy: Required form format.
- In your project: `CreateHabitDto`, `CheckinHabitDto`, `ChatDto`.

### Validation Decorators (`@IsString`, `@IsOptional`, etc.)
- Definition: Field rules inside DTO classes.
- Example:
```ts
@IsString()
@MaxLength(2000)
content: string;
```
- Analogy: Form checker before submit.
- In your project: AI chat message and context validation.

### Pipes (`ValidationPipe`)
- Definition: Validates/transforms request data globally or per route.
- Example:
```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
```
- Analogy: Security scanner at gate.
- In your project: enabled in `backend/src/main.ts`.

### API Routes
- Definition: Backend URLs frontend calls.
- Example:
  - `POST /auth/login`
  - `GET /habits`
  - `POST /ai/chat`
- Analogy: Service counters.
- In your project: auth/habits/ai routes.

### Middleware
- Definition: Logic runs before route handlers.
- Example:
```ts
app.use(cookieParser());
```
- Analogy: Checkpoint before entry.
- In your project: cookie-parser and CORS setup.

## Programming Concepts

### Promise
- Definition: Future value from async work.
- Example:
```ts
const responsePromise = api.get('/habits');
```
- Analogy: Food order token.
- In your project: all Axios calls.

### `async / await`
- Definition: Clean syntax for promises.
- Example:
```ts
const res = await api.post('/ai/chat', payload);
```
- Analogy: Wait until your number is called.
- In your project: frontend send handlers, backend DB/provider calls.

### `try/catch`
- Definition: Catch and handle runtime errors.
- Example:
```ts
try {
  const res = await api.post('/ai/chat', payload);
} catch (e) {
  // handle
}
```
- Analogy: Backup plan if something fails.
- In your project: graceful `429` and API error handling.

### `Date.now()`
- Definition: Current time in milliseconds.
- Example:
```ts
const now = Date.now();
```
- Analogy: Stopwatch reading.
- In your project: chat cooldown timer.

### Cooldown Logic
- Definition: Block repeated action for a short time.
- Example:
```ts
if (Date.now() < cooldownUntil) return;
```
- Analogy: "Please wait 30 seconds" gate.
- In your project: prevent spam after `429` response.

### Timestamps
- Definition: Numeric time values.
- Example:
```ts
setCooldownUntil(Date.now() + 30_000);
```
- Analogy: Expiry time on a ticket.
- In your project: cooldown countdown.

### Array Methods (`slice`, `map`)
- Definition:
  - `slice`: get subset.
  - `map`: transform each item.
- Example:
```ts
const last20 = messages.slice(-20);
const lines = messages.map((m) => `${m.role}: ${m.content}`);
```
- Analogy: Pick last pages; rewrite each line.
- In your project: send last 20 messages, build conversation text.

### Object Spread
- Definition: Copy/merge object fields.
- Example:
```ts
const next = { ...prev, loading: true };
```
- Analogy: Duplicate form and change one field.
- In your project: common in Redux/state updates.

### TypeScript Basics (types, interfaces)
- Definition: Adds type safety to JavaScript.
- Example:
```ts
type ChatMessage = { role: 'user' | 'assistant'; content: string };
```
- Analogy: Labels on storage boxes.
- In your project: DTOs, Redux types, component prop types.

## Also Used In This Project

### Redux Toolkit
- Definition: Central app state management.
- Example:
```ts
dispatch(addMessage({ role: 'user', content: text }));
```
- In your project: `authSlice`, `habitSlice`, `chatSlice`.

### Axios
- Definition: HTTP client for API calls.
- Example:
```ts
api.post('/ai/chat', body);
```
- In your project: all frontend requests.

### JWT + AuthGuard
- Definition: Token-based protected routes.
- Example:
```ts
@UseGuards(AuthGuard('jwt'))
```
- In your project: protects habits and AI routes.

### Throttling
- Definition: Request rate limit.
- Example:
```ts
ThrottlerModule.forRoot({ throttlers: [{ ttl: 60, limit: 3 }] })
```
- In your project: backend anti-spam + quota protection.

### MongoDB + Mongoose
- Definition: Database + schema/model layer.
- Example:
```ts
this.habitModel.find({ userId });
```
- In your project: stores users and habits.
