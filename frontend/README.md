# Meetlocal Frontend

The Next.js 14 web application for **Local Meetup RSVP Tracker**.

## Key Features

1. **Next.js 14 App Router**: Dynamic page rendering with TypeScript.
2. **Context Auth Provider (`AuthContext.tsx`)**: Global auth state with JWT token persistence in `localStorage`.
3. **Protected Routes (`ProtectedRoute.tsx`)**: Guards event creation, edit, and dashboard pages.
4. **Quick Login Buttons**: 1-click test login as pre-seeded accounts (Alice, Bob, Charlie).
5. **Interactive RSVP Buttons**: Real-time RSVP updates (`going`, `maybe`, `declined`).
6. **Attendee List**: Grouped attendee view by RSVP status.
7. **Search & Filter**: Filter events by keyword (title, location, description).

## Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running Locally

```bash
npm install
npm run dev
```
