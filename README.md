# 📍 Meetlocal - Local Meetup RSVP Tracker

A full-stack web application for organizing local meetup events and managing RSVPs. Built with **Next.js**, **Express.js (Node.js)**, **TypeORM**, and **MySQL**.

The application is completely containerized and runs with a single command: **`docker compose up`**.

---

## 🏗️ System Architecture & Engineering Overview

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

## 🚀 Quick Start (Single Command Boot)

Bring up the entire stack (Database, Backend API, and Next.js Frontend) cold:

```bash
docker compose up --build
```

### Access Points
- **Frontend App**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 🔑 Pre-Seeded Users (For Instant Testing)

Registration is optional as pre-seeded user accounts are generated on startup:

| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Alice Johnson** | `alice@example.com` | `password123` | Event Organizer |
| **Bob Smith** | `bob@example.com` | `password123` | Community Member |
| **Charlie Davis** | `charlie@example.com` | `password123` | Tech Enthusiast |

---

## 🗄️ Relational Database Schema Design

The MySQL database schema is strictly normalized (1NF, 2NF, 3NF compliant) with foreign keys and cascade rules.

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

### Critical Database Integrity Guarantees
1. **Cascade Deletes**: Deleting an event automatically removes associated RSVPs (`ON DELETE CASCADE`). Deleting a user cleans up their organized events and RSVPs.
2. **Unique Composite Index**: A composite index on `(event_id, user_id)` guarantees that a user cannot submit conflicting or duplicate RSVPs for the same event.

---

## 🛡️ Authentication & Access Control Architecture

1. **Authentication (`authMiddleware.js`)**:
   - Uses **JWT (JSON Web Tokens)** signed with bcrypt-hashed passwords.
   - Decodes `Authorization: Bearer <token>` header on protected routes and populates `req.user`.

2. **Server-Side Ownership Enforcement (`ownershipMiddleware.js`)**:
   - Modifying (`PUT`) or deleting (`DELETE`) an event requires ownership validation.
   - The server verifies `event.organizer_id === req.user.id`.
   - Returns `403 Forbidden` if a non-organizer attempts to edit/delete an event.

---

## 📡 REST API Documentation

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch currently logged-in user profile |
| `GET` | `/api/auth/users` | Public | List seeded users for quick user switching |
| `GET` | `/api/events` | Public | Browse all events (supports `?search=` filter) |
| `GET` | `/api/events/:id` | Public | View single event details & attendee list |
| `POST` | `/api/events` | Protected | Create a new meetup event |
| `PUT` | `/api/events/:id` | Owner | Update event (Enforced by `ownershipMiddleware`) |
| `DELETE`| `/api/events/:id` | Owner | Delete event (Enforced by `ownershipMiddleware`) |
| `POST` | `/api/events/:id/rsvp` | Protected | Submit or update RSVP status (`going`, `maybe`, `declined`) |
| `GET` | `/api/events/:id/rsvp` | Public | Fetch attendee list for an event |

---

## 💡 Candidate Walkthrough & Interview Defense Guide

If asked to explain technical decisions during the live interview:

1. **Why TypeORM `EntitySchema` instead of TS decorators?**
   - Enables pure JavaScript runtime without requiring Babel/TSC compilation overhead in container environments, while retaining full TypeORM repository abstraction and schema synchronization capabilities.
2. **Where is ownership enforced and why?**
   - Enforced on the **server-side** inside `ownershipMiddleware.js`. Client-side checks only hide buttons in the UI, whereas server-side middleware prevents malicious Postman / cURL requests.
3. **How does single-command Docker cold boot work?**
   - `docker-compose.yml` uses container healthchecks (`mysqladmin ping`). The backend service container delays startup until MySQL is verified as `service_healthy`. On startup, TypeORM synchronizes table structures and executes `seedData.js`.
