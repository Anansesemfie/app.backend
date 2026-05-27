# Period Management — Agent Guide

> **Platform:** Anansesemfie Audio Book API (Node.js / Express / MongoDB)  
> **Audience:** AI agents, automation scripts, and admin operators who need to query, create, or transition billing periods.  
> **Base path:** All period endpoints live under `/admin/period` and require a valid Bearer JWT (`REQUIREAUTH` middleware).

---

## 1. What Is a Period?

A **Period** is a billing window (typically one calendar month) that gates all engagement data — book views (`Seen`), plays, reactions, and comments are all stamped with the active period's `_id`. Revenue reports and dashboard analytics are scoped to a period.

**Invariant:** At any point in time **at most one period may be `active: true`**.  
When a new period is created, the service automatically deactivates the previous active period before inserting the new one.

---

## 2. Data Model

| Field       | Type      | Required | Notes                                             |
|-------------|-----------|----------|---------------------------------------------------|
| `_id`       | ObjectId  | auto     | MongoDB document ID                               |
| `year`      | Number    | ✅       | 4-digit calendar year (e.g. `2026`)               |
| `month`     | Number    | ✅       | 1-indexed month (`1`–`12`)                        |
| `startDate` | Date      | ✅       | First instant of the period window                |
| `endDate`   | Date      | ✅       | Last instant of the period window                 |
| `active`    | Boolean   | default `true` | Whether this is the current billing period |
| `createdAt` | Date      | auto     | Document creation timestamp                       |
| `updatedAt` | Date      | auto     | Last modification timestamp                       |

**Response shape** (`PeriodResponseType`):

```json
{
  "id": "664abc123...",
  "year": 2026,
  "month": 5,
  "startDate": "2026-05-01T00:00:00.000Z",
  "endDate": "2026-05-31T23:59:59.999Z",
  "status": "active",
  "createdAt": "2026-05-01T00:00:00.000Z",
  "updatedAt": "2026-05-01T00:00:00.000Z"
}
```

`status` is derived: `"active"` when `active === true`, `"inactive"` otherwise.

---

## 3. API Endpoints

All routes require the header:

```
Authorization: Bearer <admin_jwt>
```

### 3.1 Get Latest Active Period

```
GET /admin/period/
```

Returns the most-recently-created period where `active = true`. An agent should call this to discover the current period `_id` before creating engagement records.

**Success (200):**
```json
{ "data": { "id": "...", "status": "active", ... } }
```

**When no active period exists:** returns `null` inside `data`. Any `Seen`/play recording will fail with `404` until a new period is created.

---

### 3.2 Fetch a Specific Period

```
GET /admin/period/single/:id
```

| Param | Description          |
|-------|----------------------|
| `id`  | MongoDB `_id` string |

---

### 3.3 Fetch All Periods

```
GET /admin/period/all
```

Returns all periods sorted by `createdAt` descending (newest first). Useful for history, revenue rollups, and auditing.

---

### 3.4 Create a New Period

```
POST /admin/period/create
Content-Type: application/json
```

**Option A — Auto-generate for current month (recommended):**

Send an empty body `{}`. The service computes `startDate` = first day of the current month, `endDate` = last day of the current month, and derives `year`/`month` automatically.

**Option B — Explicit custom period:**

```json
{
  "startDate": "2026-06-01T00:00:00.000Z",
  "endDate":   "2026-06-30T23:59:59.999Z",
  "year":  2026,
  "month": 6,
  "active": true
}
```

**Side effects on create:**
1. The service queries for the current active period.
2. If one exists, it is **deactivated** (`active → false`, `endDate → today`) before insertion.
3. The new period is inserted with `active: true`.

**Validation errors (400):**
- `startDate` or `endDate` missing.
- `startDate` is after `endDate`.

---

### 3.5 Update a Period

```
PUT /admin/period/:id
Content-Type: application/json
```

Partial update. Accepts any subset of `PeriodType` fields.

```json
{
  "endDate": "2026-05-28T23:59:59.999Z"
}
```

Use sparingly — mutating dates after engagement data has been recorded can cause analytics drift.

---

### 3.6 Deactivate a Period

```
PUT /admin/period/:id/deactivate
```

No request body needed. The service:
1. Sets `active → false`.
2. Sets `endDate → today` (current server date).

**Use case:** Manually close a period early, e.g. before a system migration or if auto-creation failed.

---

## 4. Auto-Creation Cron Job

A `node-cron` job fires at **00:00 on the 1st of every month** (`0 0 1 * *`). It reads the `autoPeriodCreation` flag from the singleton `AppConfig` document.

| Flag state | Behaviour |
|-----------|-----------|
| `true` (default) | Deactivates the current period, inserts a new one for the new month — identical to calling `POST /admin/period/create` with no body. |
| `false` | Job skips silently. Admins must call `POST /admin/period/create` manually before the 1st or immediately after midnight. |

The job is registered once in `src/jobs/periodJob.ts` and started after the MongoDB connection is confirmed in `src/index.ts`.

---

## 5. App Config: `autoPeriodCreation` Flag

Managed through:

```
GET  /admin/settings        # read current config
PUT  /admin/settings        # update config
```

**Toggle auto-creation off:**
```json
{ "autoPeriodCreation": false }
```

**Toggle it back on:**
```json
{ "autoPeriodCreation": true }
```

The `AppConfig` collection holds a **singleton document** (upserted on first read). Default value is `autoPeriodCreation: true`.

---

## 6. Downstream Impact

When **no active period** exists, the following operations fail with `404 Not Found`:

| Operation | Service method |
|-----------|---------------|
| User views a book (`Seen` creation) | `SeenService.createNewSeen()` |
| User plays a chapter | `SeenService.recordPlay()` |
| Engagement counts per book | `SeenService.getSeensAndPlay()` |

Reactions (`ReactionType.period`) and Comments (`CommentType.period`) also reference the current period at write time. Stale or missing periods will produce incorrect analytics aggregations.

---

## 7. Agent Decision Flow

```
START
  │
  ▼
Is there an active period?  ──── GET /admin/period/ ────►  null?
  │ yes                                                        │
  │                                                            ▼
  │                                                   POST /admin/period/create
  │                                                   (empty body = auto current month)
  │                                                            │
  ◄───────────────────────────────────────────────────────────┘
  │
  ▼
Is today the 1st of the month AND autoPeriodCreation = false?
  │ yes
  ▼
POST /admin/period/create   ← must be called by operator/agent before midnight
  │
  ▼
Log new period _id and confirm status = "active"
  │
  ▼
END
```

---

## 8. Common Error Codes

| HTTP | Message | Cause |
|------|---------|-------|
| `400` | Period start and end dates are required | Missing `startDate`/`endDate` in create payload |
| `400` | Period start date cannot be after end date | `startDate > endDate` |
| `400` | Period ID is required | Called `update` or `deactivate` without an ID |
| `404` | No active period found. | `SeenService` or other consumers cannot find an active period |

---

## 9. Recommended Agent Checklist

Before performing any operation that touches engagement data:

1. **`GET /admin/period/`** — Assert `data.status === "active"`. If `data` is null, go to step 2.
2. **`POST /admin/period/create`** — Create the period for the current month (empty body).
3. **Re-verify** — Repeat step 1 to confirm `status === "active"` and record the `id`.
4. **On the 1st of each month** — Confirm the cron job ran (check server logs for `"Period created: …"`) OR manually trigger step 2 if `autoPeriodCreation` is `false`.
5. **Never create two periods with the same `year` + `month`** — there is no unique index enforcing this; duplicate active periods will cause analytics to be split across documents.

---

## 10. Source Reference

| File | Role |
|------|------|
| [src/db/models/Period.ts](../src/db/models/Period.ts) | Mongoose schema |
| [src/db/repository/periodRepository.ts](../src/db/repository/periodRepository.ts) | DB access layer |
| [src/services/periodService.ts](../src/services/periodService.ts) | Business logic |
| [src/controllers/admin/periodController.ts](../src/controllers/admin/periodController.ts) | Express handlers |
| [src/api/routes/admin/PeriodRoute.ts](../src/api/routes/admin/PeriodRoute.ts) | Route definitions |
| [src/jobs/periodJob.ts](../src/jobs/periodJob.ts) | Monthly cron job |
| [src/services/admin/appConfigService.ts](../src/services/admin/appConfigService.ts) | `autoPeriodCreation` flag |
| [src/services/seenService.ts](../src/services/seenService.ts) | Primary downstream consumer |
| [src/dto/index.ts](../src/dto/index.ts) | `PeriodType` / `PeriodResponseType` |
