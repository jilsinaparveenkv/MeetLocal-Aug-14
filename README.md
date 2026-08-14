# Meetlocal - Local Meetup RSVP Tracker

A full-stack web application for organizing local meetup events and tracking RSVPs. Built with Next.js, TypeScript, Node.js, Express, TypeORM, and MySQL.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, TypeORM
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## Features

- **Seeded User Accounts**: Login quickly with pre-seeded demo users.
- **Event Management**: Browse upcoming events, view details, create events, and edit or delete events you organized.
- **RSVP Tracking**: Submit and update RSVP status (`going`, `maybe`, `declined`) and view the list of attendees.
- **Search & Filtering**: Search events by title, location, or description.
- **Toast Notifications**: Real-time feedback for login, logout, event creation, updates, deletion, and RSVPs.
- **Server-Side Authorization**: Ownership enforcement prevents non-organizers from editing or deleting events via API requests.

## Getting Started

### Using Docker Compose

To start the database, backend, and frontend with a single command:

```bash
docker compose up --build
```

### Local Development

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## Test Users

Seed users are created automatically on database initialization with password `password123`:

| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Alice Johnson** | `alice@example.com` | `password123` | Event Organizer |
| **Bob Smith** | `bob@example.com` | `password123` | Community Member |
| **Charlie Davis** | `charlie@example.com` | `password123` | Tech Enthusiast |

## API Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | No | Authenticate user and return JWT token |
| `GET` | `/api/auth/me` | Yes | Get profile of logged-in user |
| `GET` | `/api/auth/users` | No | Get list of seeded users |
| `GET` | `/api/events` | No | Browse events (supports `?search=` parameter) |
| `GET` | `/api/events/:id` | No | Get event details and attendee list |
| `POST` | `/api/events` | Yes | Create a new meetup event |
| `PUT` | `/api/events/:id` | Yes (Owner) | Update an event |
| `DELETE`| `/api/events/:id` | Yes (Owner) | Delete an event |
| `POST` | `/api/events/:id/rsvp` | Yes | Submit or update RSVP status |
| `GET` | `/api/events/:id/rsvp` | No | Get list of RSVPs for an event |

## Authentication & Authorization

- **JWT Authentication**: Users receive a signed JWT token upon login, passed via the `Authorization: Bearer <token>` header.
- **Server-Side Authorization**: Protected endpoints (`PUT` and `DELETE` on `/api/events/:id`) verify that `event.organizer_id === req.user.id`, returning `403 Forbidden` if unauthorized.

## Database Schema

- **`users`**: `id`, `name`, `email` (unique), `password`, `created_at`, `updated_at`.
- **`events`**: `id`, `title`, `description`, `location`, `date_time`, `organizer_id` (FK to `users.id` with `ON DELETE CASCADE`).
- **`rsvps`**: `id`, `event_id` (FK to `events.id`), `user_id` (FK to `users.id`), `status` (`going`, `maybe`, `declined`). Has a composite unique constraint on `(event_id, user_id)` to prevent duplicate RSVPs.
