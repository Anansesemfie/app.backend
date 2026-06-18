# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

Use Node/TypeScript scripts from `package.json`:

- `npm run dev` — run API in TypeScript with hot reload (`ts-node` + `nodemon`).
- `npm run build` — compile TypeScript from `src/` to `dist/`.
- `npm start` — run compiled server via `nodemon dist/index.js`.
- `npm run start-prod` — run compiled server in production mode (`NODE_ENV=production node dist/index.js`).

Testing/lint status in this repo:

- There is no real test runner configured right now.
  - `npm test` currently runs `nodemon app.js` (not a test suite).
  - No `test/` suite or single-test command exists yet.
- There is no lint script/config committed.
- Use `npm run build` as the main validation command for TypeScript correctness.

## High-level architecture

This is an Express + TypeScript REST API for the Anansesemfie audiobook platform, backed by MongoDB (Mongoose), with Redis/BullMQ used for caching, rate-limit storage, and scheduled jobs.

### Request and layering model

Main flow is:

`Route -> Middleware -> Controller -> Service -> Repository -> Mongoose Model`

- `src/index.ts` bootstraps Express middleware, mounts consumer routes at `/` and admin routes at `/admin`, waits for MongoDB connection before listening, and starts the monthly period automation job.
- Controllers are thin request/response wrappers and consistently delegate errors through `CustomErrorHandler.handle(...)`.
- Services hold business logic and orchestrate cross-domain operations.
- Repositories are the direct DB access layer over Mongoose models.

### Routing surfaces

- Consumer API is aggregated in `src/api/routes/consumer/index.ts`.
- Admin API is aggregated in `src/api/routes/admin/index.ts`.
- Auth middleware in `src/api/middlewares/CheckApp.ts`:
  - `CHECKAPPTOKEN` = optional session token decode.
  - `REQUIREAUTH` = mandatory session token decode.

### Authentication/session model

- JWTs encode **session IDs**, not user IDs directly.
- `CHECKAPPTOKEN`/`REQUIREAUTH` decode bearer tokens and set `res.locals.sessionId`.
- Services resolve the effective user through `sessionService.getSession(sessionId)`.
- Admin authorization is enforced in admin services (example: `dashboardService.assertAdmin`).

### Data/model organization

- `src/db/models/index.ts` initializes MongoDB connection and registers all models.
- Domain model files live in `src/db/models/`.
- DTO/types are centralized in `src/dto/index.ts`.

### Infra integrations and runtime behavior

- Env vars are centralized in `src/utils/env.ts` and should be imported from there (do not read `process.env` directly in feature code).
- Sentry is initialized via `src/instrument.ts`, imported first by `src/index.ts`.
- Redis client setup and online/offline state are in `src/utils/redis.ts`.
  - Cache helpers (`src/services/utils/cacheService.ts`) no-op safely when Redis is unavailable.
  - Rate limiter middleware (`src/api/middlewares/rateLimiter.ts`) dynamically falls back to in-memory limits if Redis is offline.
- Monthly period automation uses BullMQ + Redis in `src/jobs/periodJob.ts`, scheduled with cron pattern `0 0 1 * *`.

### Payment/media/notification paths

- Paystack integration is in `src/utils/paystack.ts` (transaction init + verify).
- S3 signed upload/delete support is in `src/utils/aws-s3.ts` (default image bucket unless a bucket is explicitly provided).
- Notifications are routed through `notificationService`:
  - WhatsApp via Brevo if user has WhatsApp and sender is enabled.
  - Email otherwise, with provider fallback chain in `emailService` (Brevo -> SendGrid -> Nodemailer).
