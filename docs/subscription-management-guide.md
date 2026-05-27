# Subscription Management Guide (Frontend Agent)

**Platform:** Anansesemfie Audio Book API  
**Base URL:** `{{BASE_URL}}` (e.g. `https://api.anansesemfie.com`)  
**Auth:** All protected endpoints require `Authorization: Bearer <token>` where `<token>` is obtained from `POST /user/login`.

---

## Overview

Subscriptions in Anansesemfie are a two-layer system:

| Layer | Model | Description |
|---|---|---|
| **Plan** (`Subscription`) | The template sold to users | Defines name, price, duration, and display settings |
| **Subscriber record** | A user's active instance of a plan | Created per purchase; holds payment reference, activation state, and linked books |

A user always has exactly one current subscriber record referenced in their profile (`user.subscription`). Purchasing a new plan replaces (overwrites) that reference.

---

## Data Models

### Subscription Plan (read-only for consumers)

```json
{
  "id": "664f...",
  "name": "Premium Monthly",
  "active": true,
  "visible": true,
  "amount": 2500,
  "duration": 2592000000,
  "users": 1,
  "autorenew": false,
  "origin": "664e...",
  "accent": "#7C3AED",
  "createdAt": "2024-05-15T10:00:00.000Z"
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | MongoDB ObjectId |
| `name` | string | Display name for the plan |
| `amount` | number | Price in GHS (NOT kobo). `0` = free plan |
| `duration` | number | Subscription length in **milliseconds** (e.g. `2592000000` = 30 days) |
| `users` | number | Seat count (currently always `1`) |
| `autorenew` | boolean | Whether the subscription auto-renews |
| `accent` | string | Hex color for UI theming the plan card |
| `active` | boolean | Whether this plan is available for purchase |
| `visible` | boolean | Whether this plan is shown in the listing |

> **Duration tip:** Convert to days with `duration / 86400000`. The default is `2592000000` ms = 30 days.

---

## Complete Subscription Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION FLOW                        │
│                                                             │
│  1. Fetch Plans      GET /subscription/                     │
│         │                                                   │
│  2. User selects plan                                       │
│         │                                                   │
│  3. Initiate         POST /user/subscribe                   │
│         │            { "subscription": "<planId>" }         │
│         │                                                   │
│         ├─── FREE plan (amount = 0) ─────────────────────► │
│         │    Response: { data: {} } ← paymentDetails empty  │
│         │    ✅ Subscription is IMMEDIATELY active          │
│         │                                                   │
│         └─── PAID plan (amount > 0) ──────────────────────► │
│              Response: { data: { authorization_url, ... }}  │
│              Redirect user to authorization_url             │
│                       │                                     │
│              Paystack processes payment server-side         │
│              ✅ Subscription activated by the server        │
└─────────────────────────────────────────────────────────────┘
```

---

## Endpoints

### 1. List Available Subscription Plans

Browse all plans that are active **and** visible. These are the plans you show on your pricing/upgrade page.

```
GET /subscription/
```

**Auth required:** No  
**Rate limited:** No

**Response `200`:**
```json
{
  "data": [
    {
      "id": "664f1a2b3c4d5e6f7a8b9c0d",
      "name": "Starter",
      "active": true,
      "visible": true,
      "amount": 0,
      "duration": 2592000000,
      "users": 1,
      "autorenew": false,
      "origin": "664e000000000000000000ff",
      "accent": "#10B981",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "664f1a2b3c4d5e6f7a8b9c0e",
      "name": "Premium Monthly",
      "active": true,
      "visible": true,
      "amount": 2500,
      "duration": 2592000000,
      "users": 1,
      "autorenew": false,
      "origin": "664e000000000000000000ff",
      "accent": "#7C3AED",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get a Single Subscription Plan

Fetch details of one specific plan by ID.

```
GET /subscription/:subscriptionId
```

**Auth required:** No

**Path parameters:**
| Param | Type | Description |
|---|---|---|
| `subscriptionId` | string | The plan's MongoDB ObjectId |

**Response `200`:**
```json
{
  "data": {
    "id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Premium Monthly",
    "amount": 2500,
    ...
  }
}
```

**Error `404`:** Plan not found.

---

### 3. Purchase / Initiate a Subscription

Creates a subscriber record for the authenticated user and either activates it immediately (free plan) or initialises a Paystack payment (paid plan).

```
POST /user/subscribe
Authorization: Bearer <token>
Content-Type: application/json
```

**Auth required:** Yes

**Request body:**
```json
{
  "subscription": "664f1a2b3c4d5e6f7a8b9c0e"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `subscription` | string | ✅ | The **plan** ID (from step 1) |

---

#### Case A — Free Plan (`amount = 0`)

**Response `201`:**
```json
{
  "data": {}
}
```
`paymentDetails` is an empty object. The subscriber record was activated immediately. No further action needed — refresh the user's profile to confirm.

---

#### Case B — Paid Plan (`amount > 0`)

**Response `201`:**
```json
{
  "data": {
    "status": true,
    "message": "Authorization URL created",
    "data": {
      "authorization_url": "https://checkout.paystack.com/nkdks46nymizns7",
      "access_code": "nkdks46nymizns7",
      "reference": "7PVGX8MEk85tgeEpVDtD"
    }
  }
}
```

**Action required:** Redirect the user to `data.data.authorization_url`. Paystack will process payment and activate the subscription server-side — no further API call is needed from the frontend.

---

### 4. Link an Existing Subscriber Record to a User

If a subscriber record exists (e.g., created on another device or session) but is not yet linked to the user's profile, use this endpoint to associate it.

```
PUT /user/subscribe/link
Authorization: Bearer <token>
Content-Type: application/json
```

**Auth required:** Yes

**Request body:**
```json
{
  "ref": "7PVGX8MEk85tgeEpVDtD"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `ref` | string | ✅ | The Paystack transaction reference or internal ref |

**Response `201`:**
```json
{
  "data": {
    "id": "663c...",
    "email": "user@example.com",
    "subscription": "665a1b2c3d4e5f6a7b8c9d0e",
    ...
  }
}
```

---

## Authentication

All protected endpoints (`POST /user/subscribe`, `PUT /user/subscribe/link`) require a valid session token.

**Obtain a token:**
```
POST /user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret"
}
```

**Response:**
```json
{
  "data": {
    "email": "user@example.com",
    "username": "johndoe",
    "token": "<jwt>",
    "role": 0,
    "subscription": {
      "active": true,
      "id": "665a1b2c3d4e5f6a7b8c9d0e"
    }
  }
}
```

Use `token` as a Bearer token on all subsequent authenticated requests:
```
Authorization: Bearer <token>
```

> Tokens expire after **30 days**.

---

## Checking a User's Current Subscription

After login or after completing a purchase, call `GET /user/profile` to read the user's current subscription state.

```
GET /user/profile
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "data": {
    "id": "663c...",
    "email": "user@example.com",
    "username": "johndoe",
    "subscription": "665a1b2c3d4e5f6a7b8c9d0e",
    "active": true,
    ...
  }
}
```

- `subscription` — the subscriber record ID (not the plan ID). If `null` or empty, the user has no active subscription.
- To get full details about the plan the user is on, cross-reference with `GET /subscription/:planId` using the plan's ID.

---

## Frontend Integration Patterns

### React / Next.js — Subscription Page

```typescript
// 1. Fetch available plans on page load
const { data } = await fetch('/subscription/').then(r => r.json());
const plans: SubscriptionPlan[] = data;

// 2. Render plan cards using plan.accent for theming
// plan.amount === 0 → show "Free" badge

// 3. On plan select — initiate
async function selectPlan(planId: string) {
  const res = await fetch('/user/subscribe', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription: planId }),
  });
  const { data } = await res.json();

  if (!data || Object.keys(data).length === 0) {
    // FREE plan — already activated
    router.push('/dashboard');
    return;
  }

  // PAID plan — redirect to Paystack; activation is handled server-side
  const { authorization_url } = data.data;
  window.location.href = authorization_url;
}
```

---

## Error Reference

All errors follow this shape:

```json
{
  "code": "NOT_FOUND",
  "message": "Subscription not found",
  "status": 404
}
```

| HTTP Status | Code | Common Cause |
|---|---|---|
| `400` | `BAD_REQUEST` | Missing required fields |
| `401` | `UNAUTHORIZED` | Missing or expired `Authorization` header |
| `403` | `FORBIDDEN` | Token valid but action not permitted (e.g. already logged in on login) |
| `404` | `NOT_FOUND` | Plan or subscriber record ID does not exist |
| `429` | `TOO_MANY_REQUESTS` | Rate limit hit on auth endpoints (10 req / 15 min) |
| `500` | `INTERNAL_SERVER_ERROR` | Server-side failure |

---

## Key Business Rules

1. **One active subscription per user.** Initiating a new subscription overwrites `user.subscription` with the new subscriber record ID.
2. **Free plans activate immediately.** When `amount === 0`, no Paystack step is needed.
3. **Duration is in milliseconds.** Convert: `durationMs / 86400000 = days`.
4. **Only visible + active plans appear** in `GET /subscription/`. A plan may be active (available) but not visible (hidden from the consumer UI). Both flags must be `true` for the plan to appear in the listing.
