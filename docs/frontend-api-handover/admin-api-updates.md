# Admin API Additions (2026-05-09)

This document details the new admin API endpoints recently implemented to power the Hearth, Subscriptions, Revenue, and Conversation pages.

---

## 1. Dashboard / Hearth

### Stats Summary
`GET /admin/dashboard/stats`
- **Auth:** Required (Admin)
- **Description:** High-level metrics for the main dashboard.
- **Response (200):**
```json
{
  "data": {
    "users": 150,
    "books": 24,
    "activeSubscribers": 12
  }
}
```

### Listening Pulse (Chart)
`GET /admin/dashboard/pulse?days=14`
- **Auth:** Required (Admin)
- **Description:** Data for the "Listening Activity" line chart.
- **Query Params:** `days` (Default: 14, Max: 90)
- **Response (200):**
```json
{
  "data": [
    { "date": "2026-05-01", "plays": 12 },
    { "date": "2026-05-02", "plays": 8 },
    ...
  ]
}
```

---

## 2. Subscriptions

### Subscription Stats
`GET /admin/subscriptions/stats`
- **Auth:** Required (Admin)
- **Description:** Detailed subscriber metrics and recent activity.
- **Response (200):**
```json
{
  "data": {
    "active": 45,
    "byPlan": [
      { "name": "Monthly", "count": 30, "amount": 15 },
      { "name": "Yearly", "count": 15, "amount": 150 }
    ],
    "recent": [
      {
        "id": "sub_123",
        "user": { "username": "jdoe", "email": "john@example.com", "dp": "url_to_img" },
        "plan": "Monthly",
        "autorenew": false,
        "activatedAt": "2026-04-27T14:30:00Z",
        "expiresAt": "2026-05-27T14:30:00Z",
        "daysRemaining": 0
      }
    ]
  }
}
```

**New fields (added 2026-05-27):**

| Field | Type | Notes |
|---|---|---|
| `autorenew` | `boolean` | Whether the plan auto-renews. Inherited from plan — same value for all subscribers on the same plan. |
| `expiresAt` | `string (ISO 8601) \| null` | `activatedAt + plan duration`. `null` if the subscriber was never activated. |
| `daysRemaining` | `number \| null` | Signed integer — positive = days until expiry, negative = days past expiry, `null` = never activated. Use for the status badge. |

**Badge mapping for `daysRemaining`:**

| Value | Badge |
|---|---|
| `null` | — (no badge — subscriber not yet active) |
| `≤ 0` | ⬛ Expired |
| `1 – 6` | 🔴 < 7 days |
| `7 – 14` | 🟡 7 – 14 days |
| `> 14` | 🟢 Active |

---

## 3. Revenue

### Revenue Summary
`GET /admin/revenue/summary`
- **Auth:** Required (Admin)
- **Description:** Financial health metrics.
- **Response (200):**
```json
{
  "data": {
    "mrr": 675,
    "totalActiveSubscribers": 45,
    "byPlan": [
      { "name": "Monthly", "amount": 15, "count": 30, "contribution": 450 },
      { "name": "Yearly", "amount": 150, "count": 15, "contribution": 225 }
    ]
  }
}
```
*Note: `contribution` is the normalized monthly value (amount / (duration / 30)) * count.*

---

## 4. Conversation (Comments)

### List Comments
`GET /admin/conversation/comments?page=1&limit=20&bookId=...`
- **Auth:** Required (Admin)
- **Description:** Paginated list of comments for moderation.
- **Query Params:** `page`, `limit`, `bookId` (optional)
- **Response (200):**
```json
{
  "data": {
    "results": [
      {
        "id": "comm_456",
        "comment": "Great story!",
        "createdAt": "2026-05-08T10:00:00Z",
        "book": { "id": "book_789", "title": "Ananse and the Pot of Wisdom" },
        "user": { "id": "user_111", "username": "anansi_fan", "dp": "" }
      }
    ],
    "total": 124,
    "page": 1
  }
}
```

### Delete Comment
`DELETE /admin/conversation/comments/:id`
- **Auth:** Required (Admin)
- **Description:** Soft-deletes a comment.
- **Response (200):**
```json
{
  "data": "comment deleted"
}
```

---

## 5. User Management

### Single User Fetch
`GET /admin/user/:id`
- **Auth:** Required (Admin)
- **Description:** Detailed profile for a single user (User Detail Page).
- **Response (200):**
```json
{
  "data": {
    "id": "user_111",
    "email": "user@example.com",
    "username": "jdoe",
    "account": 0,
    "active": true,
    "dp": "",
    "bio": "I love stories."
  }
}
```
