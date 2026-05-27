# Frontend Task Brief — Subscriptions Table: Expiry Columns

**Date:** 2026-05-27  
**Target page:** Admin → Subscriptions (the recent-subscribers table)  
**Effort:** Small — three new columns, one badge component, no new API calls

---

## What Changed on the Backend

`GET /admin/subscriptions/stats` → `data.recent[]` now returns three additional fields per subscriber:

```json
{
  "id": "sub_123",
  "user": { "username": "jdoe", "email": "john@example.com", "dp": "url_to_img" },
  "plan": "Monthly",
  "activatedAt": "2026-04-27T14:30:00Z",

  "autorenew":     false,
  "expiresAt":     "2026-05-27T14:30:00Z",
  "daysRemaining": 0
}
```

| Field | Type | Description |
|---|---|---|
| `autorenew` | `boolean` | Whether the parent plan auto-renews. Plan-level — all subscribers on the same plan share the same value. |
| `expiresAt` | `ISO 8601 string \| null` | `activatedAt + plan duration`. `null` means never activated. |
| `daysRemaining` | `number \| null` | Signed integer. Positive = days left. Negative = days past expiry. `null` = never activated. |

---

## What the Table Should Show Now

Add three columns to the existing recent-subscribers table.

### Column 1 — Expires

Display `expiresAt` as a human-readable date.

```
// Suggested format
null        → "—"
Date        → "27 May 2026"   (or locale equivalent)
```

### Column 2 — Status badge (derived from `daysRemaining`)

A pill/badge next to — or replacing — the existing status text.

| `daysRemaining` | Badge colour | Label |
|---|---|---|
| `null` | Grey | Pending |
| `≤ 0` | Black / dark grey | Expired |
| `1 – 6` | Red | Expires soon |
| `7 – 14` | Amber / yellow | Expiring |
| `> 14` | Green | Active |

The badge is **read-only** — no interaction needed.

**Suggested helper (adapt to your framework):**

```ts
function getExpiryBadge(daysRemaining: number | null) {
  if (daysRemaining === null) return { label: "Pending",      color: "gray"  };
  if (daysRemaining <= 0)    return { label: "Expired",       color: "black" };
  if (daysRemaining <= 6)    return { label: "Expires soon",  color: "red"   };
  if (daysRemaining <= 14)   return { label: "Expiring",      color: "amber" };
  return                            { label: "Active",        color: "green" };
}
```

### Column 3 — Auto-renew

A small icon or label showing whether the plan renews automatically.

```
autorenew === true   → ↻  (or "Auto")
autorenew === false  → —  (or "Manual")
```

Keep it compact — a single icon is enough. No toggle needed; this is informational only.

---

## Suggested Column Order (full table)

| # | Column | Source |
|---|---|---|
| 1 | User (avatar + name) | `user.dp`, `user.username` |
| 2 | Email | `user.email` |
| 3 | Plan | `plan` |
| 4 | Activated | `activatedAt` |
| 5 | Expires | `expiresAt` ← **new** |
| 6 | Status badge | `daysRemaining` ← **new** |
| 7 | Auto-renew | `autorenew` ← **new** |

---

## Type Reference

```ts
type AdminSubscriberRecord = {
  id: string;
  user: {
    username: string;
    email: string;
    dp: string;
  };
  plan: string;
  autorenew: boolean;
  activatedAt: string | null;  // ISO 8601
  expiresAt: string | null;    // ISO 8601; null = never activated
  daysRemaining: number | null; // signed; negative = expired; null = never activated
};

type StatsResponse = {
  data: {
    active: number;
    byPlan: { name: string; count: number; amount: number }[];
    recent: AdminSubscriberRecord[];
  };
};
```

---

## Nothing Else Changes

- The API call is the same: `GET /admin/subscriptions/stats`
- No new endpoints
- No request body changes
- `byPlan` and `active` are untouched
- The existing `activatedAt` column stays — it is complementary to `expiresAt`

---

## Related Docs

- Full admin API reference: [`frontend-admin-guide.md`](./frontend-admin-guide.md)
- API changelog: [`admin-api-updates.md`](./admin-api-updates.md)
