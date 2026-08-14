# Database Architecture & Schema Documentation

This directory contains the initialization SQL scripts for the MySQL database used by **Meetlocal**.

## Entity Relationship Overview

- **`users`**: Stores user authentication credentials and profile information.
- **`events`**: Stores local meetup events created by users. Linked to `users.id` via `organizer_id`.
- **`rsvps`**: Join table storing attendance records (`going`, `maybe`, `declined`). Enforces a unique index constraint `UNIQUE(event_id, user_id)` to prevent duplicate RSVPs.

## Initial Files

- `init/001-schema.sql`: Full DDL script creating normalized database tables and foreign keys.
- `init/002-seed.sql`: Data population script containing 3 pre-configured users and sample meetup events.
