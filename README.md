# Meetlocal - Local Meetup RSVP Tracker

A full-stack web application for organizing local meetup events and managing RSVPs. Built with Next.js, Express.js (Node.js), TypeORM, and MySQL.

The application is fully containerized and can be launched with Docker Compose.

---

## System Architecture

```
┌─────────────────────────────────┐
│    Next.js 14 Web Frontend      │
│  (App Router, TypeScript, CSS)  │
└────────────────┬────────────────┘
                 │ HTTP REST API
                 │ (Bearer JWT Auth Header)
                 ▼
┌─────────────────────────────────┐
│    Express.js Node Backend      │
│  (TypeORM Data Source & Routes) │
└────────────────┬────────────────┘
                 │ TypeORM ORM Layer
                 ▼
┌─────────────────────────────────┐
│    MySQL 8.0 Database           │
│ (users, events, rsvps tables)   │
└─────────────────────────────────┘
```

---

## Quick Start

### Running with Docker Compose

To start the database, backend, and frontend with a single command:

```bash
docker compose up --build
```

### Running Locally (Without Docker)

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Access Points

- **Frontend App**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api`
- **API Health Check**: `http://localhost:5000/api/health`

---

## Pre-Seeded Users

Pre-seeded user accounts are generated automatically on startup for easy testing:

| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Alice Johnson** | `alice@example.com` | `password123` | Event Organizer |
| **Bob Smith** | `bob@example.com` | `password123` | Community Member |
| **Charlie Davis** | `charlie@example.com` | `password123` | Tech Enthusiast |

---

## Database Schema Design

The MySQL database schema includes foreign keys and cascade delete rules:

```sql
users (id, name, email [UNIQUE], password, created_at, updated_at)
  │
  ├── 1:N ──> events (id, title, description, location, date_time, organizer_id [FK->users.id ON DELETE CASCADE])
  │             │
  └── 1:N ──┐   └── 1:N ──┐
            ▼             ▼
          rsvps (id, event_id [FK], user_id [FK], status ENUM('going','maybe','declined'))
          * Composite UNIQUE constraint on (event_id, user_id)
```

### Database Integrity Guarantees

1. **Cascade Deletes**: Deleting an event automatically removes associated RSVPs (`ON DELETE CASCADE`). Deleting a user cleans up their organized events and RSVPs.
2. **Unique Composite Index**: A composite index on `(event_id, user_id)` prevents duplicate RSVPs from the same user for an event.

---

## Authentication & Access Control

1. **Authentication (`authMiddleware.js`)**:
   - Uses JWT (JSON Web Tokens) signed with bcrypt-hashed passwords.
   - Extracts `Authorization: Bearer <token>` header on protected routes to attach `req.user`.

2. **Ownership Enforcement (`ownershipMiddleware.js`)**:
   - Modifying (`PUT`) or deleting (`DELETE`) an event requires ownership validation on the server (`event.organizer_id === req.user.id`).
   - Returns `403 Forbidden` if a non-organizer attempts to modify an event.

---

## REST API Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current user profile |
| `GET` | `/api/auth/users` | Public | List seeded users for quick login |
| `GET` | `/api/events` | Public | Browse all events (supports `?search=` filter) |
| `GET` | `/api/events/:id` | Public | View single event details and RSVPs |
| `POST` | `/api/events` | Protected | Create a new meetup event |
| `PUT` | `/api/events/:id` | Owner | Update event details |
| `DELETE`| `/api/events/:id` | Owner | Delete an event |
| `POST` | `/api/events/:id/rsvp` | Protected | Submit or update RSVP status (`going`, `maybe`, `declined`) |
| `GET` | `/api/events/:id/rsvp` | Public | Fetch attendee list for an event |

---

## Interview & Project Defense Notes

If asked to explain technical decisions during a project review:

1. **Why TypeORM EntitySchema?**
   - Allows using standard JavaScript objects without needing TypeScript decorators or complex build steps for backend entity definitions.
2. **Where is authorization enforced?**
   - On the server side inside `ownershipMiddleware.js` so API requests cannot bypass UI controls.
3. **How does Docker startup ordering work?**
   - `docker-compose.yml` uses container healthchecks (`mysqladmin ping`) so the backend service waits until MySQL is ready before starting and seeding data.
