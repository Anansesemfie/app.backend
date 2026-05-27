# Consumer Frontend — Agent Build Guide

This document gives a frontend agent everything needed to build the consumer-facing Anansesemfie audio book app against this API.

---

## Base URL & Auth

All requests go to the same base URL. Every protected endpoint needs:

```
Authorization: Bearer <token>
```

The token is a JWT returned at login. Store it in memory or `localStorage`. It encodes a **session ID** (not a user ID) and expires in 2 years. Mark routes that require the header with `(auth)` below.

---

## Error Shape

All errors return the same shape:

```json
{ "code": "FORBIDDEN", "message": "...", "status": 403 }
```

Common codes: `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`, `TOO_MANY_REQUESTS`.

---

## Auth Flow

### Register
```
POST /user/add
Body: { email, username, password }
Response 201: { data: UserType }
```
After creation the API automatically:
- Sends a verification email with a link to `APP_BASE_URL/callback/verify?verificationCode=<token>`
- Assigns the user a starter subscription

The account is inactive until verified. Login will fail until `active: true`.

### Verify Account
```
GET /user/verify/:token
```
Token comes from the verification email link query param `verificationCode`. Hit this endpoint on the callback page. No auth required.

### Login
```
POST /user/login
Body: { email, password }
Response 200: {
  data: {
    email, username, dp, bio,
    token,           // store this — use as Bearer token
    role,            // 0 = user, 1 = associate, 2 = admin
    subscription: { active: boolean, id: string }
  }
}
```
Rate limited: 10 requests per 15 minutes.

### Logout
```
GET /user/logout  (auth)
Response 200: { data: null }
```
Ends the server-side session. Clear the token from the client.

### Forgot Password
```
POST /user/forgot-password
Body: { email }
Response 200: { data: { message: "Password reset email sent successfully" } }
```
Sends a reset link to `APP_BASE_URL/callback/resetPassword?token=<encryptedToken>&email=<email>`.

### Reset Password
```
PUT /user/reset-password
Body: { token, newPassword }     // token from the URL query param
Response 200: { data: { message: "Password reset successful" } }
```

---

## Books

### Book shape
```ts
{
  id: string
  title: string
  description: string
  snippet?: string
  authors?: string[]
  category: string[]       // array of category IDs
  languages: string[]      // array of language IDs
  cover: string            // S3 URL or relative path
  meta: {
    played: number
    views: number
    likes: number
    dislikes: number
    comments: number
  }
}
```

### List books
```
GET /book/?page=1&limit=10&search=<title>
Response 200: { data: { page, records, results: Book[] } }
```
If a valid auth token is provided (optional), the API filters books to those included in the user's subscription. Without a token it returns all active books.

### Get single book
```
GET /book/:bookId
Response 200: { data: Book }
```
If authenticated, access is checked against the subscription's book list. Also records a "seen" event for the user.

### Filter books
```
GET /book/filter/all?search=&language=<languageId>&category=<categoryId>&page=1&limit=10
Response 200: { data: Book[] }
```

### Liked books  (auth)
```
GET /book/liked/all
Response 200: { data: Book[] }
```

### Categories
```
GET /book/category/
Response 200: { data: [{ id, name }] }
```

### Languages
```
GET /book/languages/
Response 200: { data: [{ id, name }] }
```

---

## Content Types

Chapters are either `"audio"` or `"ebook"`. The `type` field on every chapter response determines how to render it:

| `type` | Render as |
|---|---|
| `"audio"` | Audio player — stream the file URL returned by the play endpoint |
| `"ebook"` | Ebook reader — render the file content (e.g. PDF viewer, HTML reader) |

A single book can contain a mix of both types. Check `chapter.type` before deciding which player/viewer to mount.

> **Ebook chapters can be password-protected PDFs.** If `chapter.password` is non-empty, the PDF file itself is encrypted with that password. Pass it directly to your PDF renderer to unlock the document — do not show it to the user or prompt them to enter one. The app holds the password; the user just taps open.

---

## Chapters

Both endpoints require auth. The API uses the session to validate subscription access.

### List chapters for a book  (auth)
```
GET /book/chapter/all/:bookId
Response 200: { data: Chapter[] }
```

### Get single chapter  (auth)
```
GET /book/chapter/:chapterId
Response 200: { data: Chapter }
```

Chapter shape:
```ts
{
  id: string
  title: string
  description: string
  book: BookResponseType
  password: string        // non-empty = PDF encryption password; pass to renderer, never show to user
  createdAt: string | Date
  type: "audio" | "ebook"
}
```

---

## Play / Read Content  (auth)

```
GET /chapter/play/:chapterId
Response 200: { data: chapter }   // includes the file URL
```

Single endpoint for both content types. Call it when the user taps play or open. Then branch on `type`:

- `"audio"` → pass the file URL to an audio player component
- `"ebook"` → pass the file URL to a document/PDF viewer component

Build a persistent bottom player for audio that survives navigation. Ebook chapters should open full-screen.

---

## Reactions  (auth)

### Like
```
POST /book/reaction/like/:bookId
Response 200: { data: reaction }
```

### Dislike
```
POST /book/reaction/dislike/:bookId
Response 200: { data: reaction }
```

Reactions are toggled — calling like twice removes the like.

---

## Comments

### Post comment  (auth)
```
POST /book/comment/
Body: { bookId, comment }
Response 201: { data: CommentResponse }
```

Also accessible at `POST /book/reaction/comment` with the same body.

### Get comments  (public)
```
GET /book/comment/:bookId
Response 200: { data: CommentResponse[] }
```

CommentResponse shape:
```ts
{
  id: string
  user: { id, name, picture, email }
  comment: string
  createdAt?: string
}
```

---

## Subscriptions & Payments

### List plans  (public)
```
GET /subscription/
Response 200: { data: SubscriptionPlan[] }
```

Plan shape:
```ts
{
  id, name, active, visible,
  duration,    // days
  users,       // max seats
  autorenew,
  amount,      // in GHS (or local currency)
  origin,
  accent,      // UI color accent for plan card
  createdAt
}
```
Only plans where `active: true` and `visible: true` are returned.

### Get single plan  (public)
```
GET /subscription/:subscriptionId
```

### Purchase flow  (auth)

1. User picks a plan. Call:
   ```
   POST /user/subscribe
   Body: { subscription: <subscriptionPlanId> }
   Response 201: { data: { authorization_url, access_code, reference } }
   ```
2. Redirect the user to `data.authorization_url` (Paystack payment page).
3. Paystack redirects back with `?trxref=...&reference=...`.
4. On the callback page, hit the webhook endpoint:
   ```
   GET /whcb?reference=<reference>
   Response 200: { data: ... }
   ```
   This verifies and activates the subscription server-side.
5. Optionally link the subscription manually (if reference-based):
   ```
   PUT /user/subscribe/link
   Body: { ref: <reference> }
   ```

---

## Pages to Build

| Page | Notes |
|---|---|
| `/register` | email + username + password form |
| `/login` | email + password, rate-limited |
| `/callback/verify` | reads `?verificationCode=` from URL, hits verify endpoint, shows success |
| `/callback/resetPassword` | reads `?token=&email=`, shows new password form |
| `/` (home) | paginated book grid, search bar, filter by category/language |
| `/book/:id` | book detail: cover, description, chapters list, like/dislike, comments |
| `/player` or bottom sheet | persistent audio player with chapter controls |
| `/library` | liked books (auth-gated) |
| `/subscriptions` | plan cards with purchase CTA |
| `/callback/payment` | Paystack return URL — verify and confirm |

---

## Key Business Rules

- **Subscription gates content.** A logged-in user with an active subscription sees only the books in their subscription's book list. A user without a subscription (or unauthenticated) sees all active books.
- **Account must be active to log in.** Users who haven't verified their email get `404 User not found or inactive`.
- **Token is a session ID wrapper.** Don't decode it on the client — treat it as opaque.
- **Cover images** are stored in S3 and served as full URLs.
- **Audio files** are fetched via the play endpoint — don't build your own S3 URL; always go through the API.
