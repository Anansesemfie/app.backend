# Admin Subscriber Expiry Fields Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich `GET /admin/subscriptions/stats` so each item in `data.recent` includes `expiresAt`, `daysRemaining`, and `autorenew` — turning the subscriber list into a usable support tool.

**Architecture:** No schema migrations. `expiresAt` is computed on-the-fly from `activatedAt + plan.duration` (milliseconds). `autorenew` is read from the parent plan. A module-scope `formatSubscriberRecord` helper centralises all three computations; `getStats` calls it instead of inlining the map.

**Tech Stack:** TypeScript, Node.js, Express, Mongoose, dayjs (already installed)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/dto/index.ts` | Modify | Add `AdminSubscriberRecord` response type |
| `src/services/admin/subscriptionsService.ts` | Modify | Add `formatSubscriberRecord` helper; update `getStats` populate + map |

No new files. No route or controller changes.

---

### Task 1: Add `AdminSubscriberRecord` type to the DTO

**Files:**
- Modify: `src/dto/index.ts`

This type is the contract for what the API returns per subscriber in `getStats.recent`. Define it before touching the service so TypeScript enforces the shape there.

- [ ] **Step 1: Open `src/dto/index.ts` and append the new type after `SubscriptionsResponse`**

The file currently ends with `AppConfigResponseType` at line ~279. Add this block immediately after `SubscriptionsResponse` (around line 142), before `UserType`:

```ts
export type AdminSubscriberRecord = {
  id: string;
  user: {
    username: string;
    email: string;
    dp: string;
  };
  plan: string;           // plan name from parent Subscription
  autorenew: boolean;     // parent plan's autorenew flag
  activatedAt: Date | null;
  expiresAt: Date | null;        // activatedAt + plan.duration ms; null if never activated
  daysRemaining: number | null;  // signed integer; negative = already expired; null if never activated
};
```

- [ ] **Step 2: Verify the build compiles cleanly**

```bash
npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors, output ends with something like `Found 0 errors.` or silent success.

- [ ] **Step 3: Commit**

```bash
git add src/dto/index.ts
git commit -m "feat: add AdminSubscriberRecord DTO type"
```

---

### Task 2: Add `formatSubscriberRecord` helper to the subscriptions service

**Files:**
- Modify: `src/services/admin/subscriptionsService.ts`

Add the helper function at module scope (above the class declaration). It takes a raw Mongoose document and the populated plan object, and returns a typed `AdminSubscriberRecord`.

- [ ] **Step 1: Import `AdminSubscriberRecord` at the top of the service file**

The current imports block is:

```ts
import { Subscriber, Subscription } from "../../db/models";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";
import type { SubscriptionsType } from "../../dto";
```

Replace the last import line with:

```ts
import type { AdminSubscriberRecord, SubscriptionsType } from "../../dto";
```

- [ ] **Step 2: Add `formatSubscriberRecord` above the class declaration**

After the imports block and before `class AdminSubscriptionsService {`, insert:

```ts
function formatSubscriberRecord(s: any, plan: any): AdminSubscriberRecord {
  const activatedAt = s.activatedAt ? new Date(s.activatedAt) : null;
  const expiresAt =
    activatedAt && plan?.duration
      ? new Date(activatedAt.getTime() + (plan.duration as number))
      : null;
  const daysRemaining = expiresAt
    ? Math.ceil((expiresAt.getTime() - Date.now()) / 86_400_000)
    : null;

  return {
    id: s._id,
    user: {
      username: s.user?.username ?? "—",
      email: s.user?.email ?? "—",
      dp: s.user?.dp ?? "",
    },
    plan: plan?.name ?? "—",
    autorenew: plan?.autorenew ?? false,
    activatedAt: s.activatedAt ?? null,
    expiresAt,
    daysRemaining,
  };
}
```

- [ ] **Step 3: Verify build still compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/services/admin/subscriptionsService.ts
git commit -m "feat: add formatSubscriberRecord helper"
```

---

### Task 3: Wire `formatSubscriberRecord` into `getStats`

**Files:**
- Modify: `src/services/admin/subscriptionsService.ts`

Two targeted edits inside `getStats`: expand the `populate` call to include `duration` and `autorenew`, then replace the inline `recentFormatted` map with the helper.

- [ ] **Step 1: Expand the populate call**

Find this line inside `getStats` (currently around line 40):

```ts
    .populate("parent", "name");
```

Replace it with:

```ts
    .populate("parent", "name duration autorenew");
```

- [ ] **Step 2: Replace the `recentFormatted` map block**

Find and remove this entire block (currently around lines 44–54):

```ts
  const recentFormatted = recent.map((s: any) => ({
    id: s._id,
    user: {
      username: s.user?.username ?? "—",
      email: s.user?.email ?? "—",
      dp: s.user?.dp ?? "",
    },
    plan: s.parent?.name ?? "—",
    activatedAt: s.activatedAt,
  }));
```

Replace it with:

```ts
  const recentFormatted: AdminSubscriberRecord[] = recent.map((s: any) =>
    formatSubscriberRecord(s, s.parent)
  );
```

- [ ] **Step 3: Verify the full build**

```bash
npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors.

- [ ] **Step 4: Smoke-test the endpoint manually**

Start the server:

```bash
npm run dev
```

In a second terminal, hit the stats endpoint with a valid admin JWT (replace `<TOKEN>` with a real session token):

```bash
curl -s -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/admin/subscriptions/stats \
  | jq '.data.recent[0]'
```

Expected shape — all three new fields should be present:

```json
{
  "id": "...",
  "user": { "username": "...", "email": "...", "dp": "..." },
  "plan": "Premium",
  "autorenew": false,
  "activatedAt": "2026-04-27T10:00:00.000Z",
  "expiresAt": "2026-05-27T10:00:00.000Z",
  "daysRemaining": 0
}
```

If `activatedAt` is `null` on a record, `expiresAt` and `daysRemaining` should both be `null`.

- [ ] **Step 5: Commit**

```bash
git add src/services/admin/subscriptionsService.ts
git commit -m "feat: enrich getStats recent list with expiresAt, daysRemaining, autorenew"
```

---

## Done

After Task 3, `GET /admin/subscriptions/stats` returns the three new fields on every item in `data.recent`. No DB migrations were required. The `formatSubscriberRecord` helper is available in the service file if a future roster endpoint needs the same shape.

**Known adjacent issue (out of scope):** `validateSubscription` in `src/services/subscribersService.ts` measures elapsed time from `createdAt` instead of `activatedAt`. That should be fixed separately.
