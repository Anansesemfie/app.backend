# Design: Admin Subscriber Expiry Fields

**Date:** 2026-05-27  
**Branch:** fix/period-flow-bugs  
**Status:** Approved

---

## Problem

The admin `GET /admin/subscriptions/stats` endpoint returns a `recent` list of the 20 most recently activated subscribers. Each item currently exposes only `{ id, user, plan, activatedAt }`. Admins cannot tell when a subscription expires or whether it will auto-renew without doing manual date arithmetic — making the list useless as a support tool.

---

## Goal

Add three fields to every item in `getStats.recent`:

| Field | Description |
|---|---|
| `expiresAt` | `Date \| null` — `activatedAt + plan.duration`; `null` if subscriber was never activated |
| `daysRemaining` | `number \| null` — signed days until expiry (negative = already expired); `null` if never activated |
| `autorenew` | `boolean` — the parent plan's `autorenew` flag |

The frontend maps `daysRemaining` to a colour-coded badge: 🟢 >14d · 🟡 7–14d · 🔴 0–6d · ⬛ ≤0 (expired).

---

## Scope

- **In scope:** `getStats` service method + new DTO type
- **Out of scope:** new endpoints, schema migrations, `validateSubscription` fix, amount/payment fields

---

## Decisions

| Question | Decision | Rationale |
|---|---|---|
| Which endpoint? | Enhance existing `getStats.recent` | Sufficient for current support use-case; no new endpoint needed |
| `autorenew` source | Read from parent plan (`Subscriptions.autorenew`) | Already a plan-level flag; no per-subscriber override needed |
| `expiresAt` storage | Compute on-the-fly | No sorting/filtering needed today; avoids schema migration |

---

## Data Model

New type added to `src/dto/index.ts`:

```ts
export type AdminSubscriberRecord = {
  id: string;
  user: { username: string; email: string; dp: string };
  plan: string;           // plan name
  autorenew: boolean;     // from parent plan
  activatedAt: Date | null;
  expiresAt: Date | null;        // activatedAt + plan.duration (ms)
  daysRemaining: number | null;  // signed; negative means already expired
};
```

`daysRemaining` is `Math.ceil((expiresAt − now) / 86_400_000)`. `null` means the subscriber record exists but was never activated (no `activatedAt` set).

---

## Service Layer

### `formatSubscriberRecord` helper

Added as a module-scope (unexported) function in `src/services/admin/subscriptionsService.ts`:

```ts
function formatSubscriberRecord(s: any, plan: any): AdminSubscriberRecord {
  const activatedAt = s.activatedAt ? new Date(s.activatedAt) : null;
  const expiresAt =
    activatedAt && plan?.duration
      ? new Date(activatedAt.getTime() + plan.duration)
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

### `getStats` changes

Two targeted edits inside the existing method:

1. **Populate more plan fields** — change  
   `.populate("parent", "name")`  
   to  
   `.populate("parent", "name duration autorenew")`

2. **Use the helper** — replace the `recentFormatted` map block with:  
   ```ts
   const recentFormatted = recent.map((s: any) =>
     formatSubscriberRecord(s, s.parent)
   );
   ```

---

## Files Changed

| File | Change |
|---|---|
| `src/dto/index.ts` | Add `AdminSubscriberRecord` type |
| `src/services/admin/subscriptionsService.ts` | Add `formatSubscriberRecord`; update `getStats` populate + map |

No schema migrations. No new routes. No controller changes.

---

## Known Adjacent Issue

`validateSubscription` in `src/services/subscribersService.ts` computes elapsed time from `createdAt` instead of `activatedAt`. This is out of scope here but should be addressed in a separate fix.

---

## API Response Shape (after change)

`GET /admin/subscriptions/stats` → `data.recent[n]`:

```json
{
  "id": "...",
  "user": { "username": "akosua", "email": "a@b.com", "dp": "" },
  "plan": "Premium",
  "autorenew": false,
  "activatedAt": "2026-04-27T10:00:00.000Z",
  "expiresAt": "2026-05-27T10:00:00.000Z",
  "daysRemaining": 0
}
```
