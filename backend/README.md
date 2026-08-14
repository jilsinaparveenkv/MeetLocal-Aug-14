# Meetlocal Backend API

The Express.js REST API for **Local Meetup RSVP Tracker** powered by Node.js, TypeORM, and MySQL.

## Key Features

1. **TypeORM Data Source**: Manages entity relationships (`User`, `Event`, `Rsvp`) and schema auto-synchronization.
2. **JWT Authentication (`authMiddleware.js`)**: Validates token headers and injects `req.user`.
3. **Ownership Authorization (`ownershipMiddleware.js`)**: Restricts event update and deletion privileges strictly to the event organizer.
4. **Auto Data Seeding (`seedData.js`)**: Populates test users (`alice@example.com`, `bob@example.com`, `charlie@example.com`) on initial startup.

## Environment Variables (`.env`)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=meetlocal_user
DB_PASSWORD=meetlocal_pass
DB_NAME=meetlocal_db
JWT_SECRET=meetlocal_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
```

## Running Locally

```bash
npm install
npm run dev
```
