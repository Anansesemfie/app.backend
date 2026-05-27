# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (TypeScript with hot-reload)
npm run dev

# Build TypeScript to dist/
npm run build

# Run compiled output
npm start

# Production
npm run start-prod
```

There are no tests configured beyond the placeholder script (`nodemon app.js`). The `test/` directory is empty.

## Architecture

This is the **Anansesemfie** audio book platform — a Node.js/Express REST API written in TypeScript, backed by MongoDB (Mongoose).

### Layer structure

```
src/
  index.ts              # App bootstrap, mounts routers, waits for DB before listen
  utils/env.ts          # All env vars exported as named constants — always import from here
  dto/index.ts          # All shared TypeScript types (UserType, BookType, etc.)
  db/
    models/             # Mongoose schema factories (each exports a function taking Mongoose)
    models/index.ts     # Connects to MongoDB, instantiates all models, re-exports them
    repository/         # DB access layer — one file per model
  services/             # Business logic — one file per domain
  services/admin/       # Admin-specific business logic
  controllers/          # Express handlers — thin wrappers calling services
  controllers/admin/    # Admin-specific controllers
  api/
    routes/consumer/    # Public-facing routes (prefixed at /)
    routes/admin/       # Admin routes (prefixed at /admin)
    middlewares/        # CheckApp.ts — JWT auth middleware
```

### Request flow

`Route → CHECKAPPTOKEN middleware (optional) → Controller → Service → Repository → Model`

- `CHECKAPPTOKEN` decodes the Bearer JWT and sets `res.locals.sessionId` (the session document ID). It is applied per-route-group, not globally.
- Controllers call services; services call repositories directly.
- Errors propagate as `CustomError` instances and are caught by `CustomErrorHandler.handle(error, res)` in each controller. Never throw plain strings.

### Authentication model

- JWT tokens encode a **session ID** (not the user ID directly).
- On login, a `Session` document is created; the session `_id` is JWT-signed and returned to the client.
- Downstream services resolve the actual user from the session ID via `sessionService`.

### Key integrations

- **AWS S3** (`utils/aws-s3.ts`): Two separate buckets — `AWS_S3_BUCKET_IMAGES` and `AWS_S3_BUCKET_AUDIO`. The `AWS_S3` class is instantiated with an optional preferred bucket; use `new AWS_S3(AWS_S3_BUCKET_AUDIO)` for audio uploads.
- **Paystack** (`utils/paystack.ts`): Singleton. Handles subscription payment initialization and webhook verification. Amounts are multiplied by 100 (kobo).
- **Email** (`services/emailService.ts`): Tries SendGrid first, falls back to Nodemailer. Both providers are initialized lazily on send.
- **Period/Organization**: `Period` tracks billing periods (month/year with start+end dates). `Organization` ties books to a publisher entity. Both have admin-only management routes.

### Environment variables

All required env vars are declared in `src/utils/env.ts`. Key ones:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` / `MONGODB_DBNAME` | Database connection |
| `SECRET_JWT` | JWT signing secret |
| `STARTUP_SUBSCRIPTION` | Subscription ID assigned to new users on registration |
| `AWS_S3_BUCKET_IMAGES` / `AWS_S3_BUCKET_AUDIO` | Separate S3 buckets |
| `PAYSTACK_PUBLIC_KEY` / `PAYSTACK_SECRET_KEY` | Payment gateway |
| `SENDGRID_KEY` | Email delivery |
| `CAN_LOG` | Set to `"YES"` to enable `HELPERS.LOG()` output |

### Adding a new domain

1. Add types to `src/dto/index.ts`
2. Create a Mongoose schema in `src/db/models/`
3. Register the model in `src/db/models/index.ts`
4. Create a repository in `src/db/repository/`
5. Create a service in `src/services/` (or `src/services/admin/` for admin-only)
6. Create a controller in `src/controllers/`
7. Add a route file in `src/api/routes/consumer/` or `src/api/routes/admin/` and mount it in the respective `index.ts`
