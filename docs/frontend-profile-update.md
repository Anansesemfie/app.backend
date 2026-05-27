# Frontend Agent Spec — User Profile Update (incl. WhatsApp Number)

> Everything a frontend agent needs to implement the **Get Profile** and **Update Profile** screens, including the new WhatsApp number field.

---

## 1. Authentication

All profile endpoints require a valid session token.

| Header | Value |
|---|---|
| `Authorization` | `Bearer <token>` |

The token is the JWT returned from `POST /user/login` in the `data.token` field.  
Store it in-memory or `localStorage`. All requests below assume this header is present.

---

## 2. Endpoints

### 2.1 Get Profile

```
GET /user/profile
```

**Auth:** Required (`REQUIREAUTH`)  
**Body:** none

#### Success response — `200 OK`

```json
{
  "data": {
    "id": "664a1f2e3c8a4b001d9e1234",
    "email": "user@example.com",
    "username": "kwame",
    "account": 0,
    "active": true,
    "dp": "https://cdn.example.com/avatars/kwame.jpg",
    "bio": "Loves audiobooks",
    "whatsappNumber": "+233241234567",
    "subscription": "664a1f2e3c8a4b001d9e5678",
    "createdAt": "2024-05-19T10:00:00.000Z"
  }
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | MongoDB ObjectId |
| `email` | `string` | Read-only — not editable via this endpoint |
| `username` | `string` | Editable |
| `account` | `number` | `0` = regular user, `1` = admin |
| `active` | `boolean` | `false` until email verified |
| `dp` | `string` | URL of profile picture (S3) |
| `bio` | `string` | Short bio text |
| `whatsappNumber` | `string` | E.164 format e.g. `+233241234567`. Empty string `""` if not set |
| `subscription` | `string` | Subscriber document ID |
| `createdAt` | `string` | ISO 8601 timestamp |

---

### 2.2 Update Profile

```
PATCH /user/profile
```

**Auth:** Required (`REQUIREAUTH`)  
**Content-Type:** `application/json`

#### Request body — all fields optional, send only what changed

```json
{
  "username": "kwame_updated",
  "bio": "Audiobook enthusiast from Accra",
  "dp": "https://cdn.example.com/avatars/new.jpg",
  "whatsappNumber": "+233241234567"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `username` | `string` | No | Min 2 chars, stored lowercase |
| `bio` | `string` | No | Free text |
| `dp` | `string` | No | URL to uploaded image (upload to S3 first, then send the URL here) |
| `whatsappNumber` | `string` | No | Must be valid E.164 international format **or** empty string `""` to clear it. Examples: `+233241234567`, `+447700900123` |

> **At least one field must be present** — sending an empty body returns `400`.

#### Success response — `200 OK`

Returns the full updated profile (same shape as Get Profile):

```json
{
  "data": {
    "id": "664a1f2e3c8a4b001d9e1234",
    "email": "user@example.com",
    "username": "kwame_updated",
    "account": 0,
    "active": true,
    "dp": "https://cdn.example.com/avatars/new.jpg",
    "bio": "Audiobook enthusiast from Accra",
    "whatsappNumber": "+233241234567",
    "subscription": "664a1f2e3c8a4b001d9e5678",
    "createdAt": "2024-05-19T10:00:00.000Z"
  }
}
```

---

## 3. Error responses (all endpoints)

```json
{ "error": "<message>", "status": <code> }
```

| Status | Code constant | When |
|---|---|---|
| `400` | `BAD_REQUEST` | Empty payload, or `whatsappNumber` fails E.164 validation |
| `401` | `UNAUTHORIZED` | Missing `Authorization` header |
| `403` | `FORBIDDEN` | Malformed token |
| `404` | `NOT_FOUND` | Session expired / user deleted |
| `500` | `INTERNAL_SERVER_ERROR` | Unexpected server error |

---

## 4. WhatsApp Number — UX guidance

### Format rules
- Must start with `+` followed by country code then subscriber number (no spaces, dashes, or brackets).
- Valid: `+233241234567`, `+447700900123`, `+12125551234`
- Invalid: `0241234567`, `+233 24 123 4567`, `(+233)241234567`
- To **clear** the field, send `whatsappNumber: ""`.

### Recommended input widget

```
Label: WhatsApp Number (optional)
Placeholder: +233241234567
Helper text: Include your country code, e.g. +233 for Ghana
```

- Use a phone input library (e.g. `react-phone-number-input`) to auto-prefix country codes and enforce E.164.
- Show an inline error before submitting if the value fails the pattern `/^\+[1-9]\d{6,14}$/`.

---

## 5. Typical UI flow

```
1. Mount "Edit Profile" screen
   └─ GET /user/profile
      └─ Populate form: username, bio, dp preview, whatsappNumber

2. User edits one or more fields, taps "Save"
   └─ Build payload from only the fields that changed
   └─ PATCH /user/profile  { ...changedFields }
      ├─ 200 → update local state, show success toast
      └─ 400 → show field-level validation error (check message for "phone")
      └─ 401/403 → redirect to login
```

---

## 6. Sample fetch calls (TypeScript)

```typescript
const BASE = process.env.NEXT_PUBLIC_API_URL; // e.g. https://api.anansesemfie.com

// GET profile
async function getProfile(token: string) {
  const res = await fetch(`${BASE}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return (await res.json()).data;
}

// PATCH profile
async function updateProfile(
  token: string,
  payload: {
    username?: string;
    bio?: string;
    dp?: string;
    whatsappNumber?: string;
  }
) {
  const res = await fetch(`${BASE}/user/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return (await res.json()).data;
}
```

---

## 7. Fields NOT exposed for update

These fields are managed server-side and cannot be changed via this endpoint:

| Field | How to change |
|---|---|
| `email` | Not currently supported |
| `password` | `PUT /user/reset-password` |
| `active` | Triggered by `GET /user/verify/:token` |
| `account` | Admin-only via `POST /admin/user/role` |
| `subscription` | `POST /user/subscribe` / `PUT /user/subscribe/link` |
