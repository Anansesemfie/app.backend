# Admin Frontend — Agent Build Guide

This document gives a frontend agent everything needed to build the Anansesemfie admin dashboard against this API.

---

## Base URL & Auth

All admin routes are prefixed with `/admin`. All protected endpoints require:

```
Authorization: Bearer <token>
```

Token comes from `POST /admin/user/login`. The user's `account` field must equal `2` (admin). Associates (`account: 1`) can authenticate but cannot perform privileged operations — the API will reject them with 403.

---

## Error Shape

```json
{ "code": "FORBIDDEN", "message": "...", "status": 403 }
```

---

## Auth

### Login
```
POST /admin/user/login
Body: { email, password }
Response 200: {
  data: {
    email, username, dp, bio,
    token,
    role,   // 0 = user, 1 = associate, 2 = admin
    subscription: { active, id }
  }
}
```
Gate the dashboard: if `role !== 2`, refuse entry. Associates (`role === 1`) may have limited views if you build them, but all mutating API calls will fail server-side anyway.

### Create admin/associate user  (auth, admin only)
```
POST /admin/user/add
Body: { email, username, password, account }   // account: 1 or 2
Response 201: { data: UserType }
```

---

## User Management  (auth)

### Fetch users
```
POST /admin/user/fetchUsers
Body: { search?: string, account?: number }
Response 200: { data: UserType[] }
```
`account` filters by role — omit to get all.

### Change role
```
PUT /admin/user/changeRole
Body: { userId: string, type: 0 | 1 | 2 }
Response 200: { data: UserType }
```
Role values: `0` = regular user, `1` = associate, `2` = admin.

### Send email
```
POST /admin/user/sendEmail
Body: {
  email: { to, subject, html? },
  body: { header, body, actions?: [{ title, link }], items?: [{ icon, title, description }], footer? }
}
Response 200: { data: "Email sent successfully" }
```
Used to send broadcast or individual emails from the admin panel. The API tries SendGrid first, falls back to Nodemailer.

---

## Book Management  (auth, admin only)

### Upload flow

Files (covers and audio) are uploaded directly to S3 via presigned URLs. The flow is:

**Step 1 — Get a signed URL**
```
POST /admin/book/getSignedUrl
Body: { file: "filename.ext", fileType: "audio/mpeg" }
Response 200: { data: { signedURL: string, time: 60 } }   // time = seconds until expiry
```
Use `AWS_S3_BUCKET_IMAGES` for cover images and `AWS_S3_BUCKET_AUDIO` for audio. The endpoint currently always uses the images bucket — if uploading audio chapters, you may need to call with the appropriate context.

**Step 2 — Upload to S3**
```
PUT <signedURL>
Body: <file binary>
Headers: { Content-Type: <fileType> }
```
Do this directly from the browser. No auth header needed — the URL is pre-signed.

**Step 3 — Save the record**
Use the `file` key (filename) you sent in step 1 as the `cover` or `file` field in the create/update calls.

---

### Create book
```
POST /admin/book/createBook
Body: {
  title,          // max 50 chars
  description,    // 10–1500 chars
  cover,          // S3 key from upload step
  category,       // string[] of category IDs
  languages,      // string[] of language IDs
  authors?,       // string[]
  snippet?,
  organization?,  // org ID
  associates?     // user IDs allowed to manage this book
}
Response 201: { data: BookResponseType }
```

### Update book
```
PUT /admin/book/updateBook/:id
Body: partial BookType fields
Response 203: { data: BookResponseType }
```

### Delete book
```
DELETE /admin/book/deleteBook/:id
Response 200: { data: "book deleted" }
```
Also deletes all chapters belonging to the book.

### Create chapter
```
POST /admin/book/createChapter
Body: {
  title,
  description,
  file,        // S3 key from upload step
  mimetype,    // "audio/mpeg" for audio, "application/pdf" or similar for ebooks
  password,    // ebooks: the PDF's own encryption password — the app passes this to the renderer silently; leave empty if the PDF is not encrypted
  book         // book ID this chapter belongs to
}
Response 201: { data: ChapterType }
```

Chapters are either **audio** (`type: "audio"`) or **ebook** (`type: "ebook"`). The `type` is derived from the `mimetype` you provide — audio mimetypes produce audio chapters, document mimetypes produce ebook chapters. Use the correct S3 bucket per type:

| Content type | Mimetype examples | S3 bucket env var |
|---|---|---|
| Audio | `audio/mpeg`, `audio/mp4`, `audio/ogg` | `AWS_S3_BUCKET_AUDIO` |
| Ebook | `application/pdf`, `text/html` | `AWS_S3_BUCKET_IMAGES` |

When building the chapter upload form, show different file-picker accept filters and upload the file to the appropriate bucket based on the selected content type.

### Update chapter
```
PUT /admin/book/updateChapter/:id
Body: partial ChapterType fields
Response 203: { data: ChapterType }
```

### Delete chapter
```
DELETE /admin/book/deleteChapter/:id
Response 200
```

### Book analytics
```
GET /admin/book/metrics/:bookId?period=<periodId>
Response 200: { data: { played, views, likes, dislikes, comments } }
```
`period` is optional. Pass a period ID to scope metrics to a billing period.

---

## Language Management  (auth)

### Add language
```
POST /admin/language/add
Body: { title: string, active: boolean }
Response 201: { data: LanguageType }
```

### List all languages
```
GET /admin/language/all
Response 200: { data: [{ id, name }] }
```

---

## Period Management  (auth)

Periods represent billing/analytics months. Each period has a start date, end date, year, month, and active flag. Only one period should be active at a time.

### Create period
```
POST /admin/period/create
Body: { startDate, endDate, year, month, active }
Response 200: { data: PeriodType }
```

### Get latest (active) period
```
GET /admin/period/
Response 200: { data: PeriodResponseType }
```

### List all periods
```
GET /admin/period/all
Response 200: { data: PeriodResponseType[] }
```

### Get single period
```
GET /admin/period/single/:id
Response 200: { data: PeriodResponseType }
```

### Update / deactivate period
```
PUT /admin/period/:id
Body: partial PeriodType fields (set active: false to deactivate)
Response 200: { data: PeriodResponseType }
```

PeriodResponseType:
```ts
{
  id, startDate, endDate,
  createdAt, updatedAt,
  year, month,
  status: "active" | "inactive"
}
```

---

## Organization Management  (auth)

Organizations group books under a publisher/label entity.

### Create
```
POST /admin/organization/create
Body: { name, description?, type, logo? }
Response 201: { status: "success", data: OrganizationType }
```

### List all
```
GET /admin/organization/
Response 200: { status: "success", data: OrganizationType[] }
```

### Get single
```
GET /admin/organization/:id
Response 200: { status: "success", data: OrganizationType }
```

### Update
```
PUT /admin/organization/:id
Body: partial OrganizationType
Response 200: { status: "success", data: OrganizationType }
```

OrganizationType:
```ts
{ id, name, description?, type, logo? }
```

---

## Pages to Build

| Page | Notes |
|---|---|
| `/login` | Admin-only login, reject if `role !== 2` |
| `/dashboard` | Summary stats: books, users, active period metrics |
| `/books` | Table of all books with edit/delete actions |
| `/books/new` | Create book form with S3 upload for cover |
| `/books/:id` | Book detail: edit fields, chapters list, analytics chart |
| `/books/:id/chapters/new` | Add chapter with audio upload |
| `/books/:id/analytics` | Play/views/likes/dislikes/comments — filterable by period |
| `/users` | Searchable user table, filter by role |
| `/users/:id` | User detail, role change button |
| `/languages` | Table + add form |
| `/organizations` | Table with CRUD |
| `/periods` | List with active indicator, create new period, deactivate old |
| `/email` | Compose + send broadcast email |

---

## Key Business Rules

- **Only `account === 2` users are admins.** The API enforces this server-side on every book/chapter mutating endpoint. A 403 means the logged-in user's role is wrong, not that the token is invalid.
- **S3 upload is client-direct.** Never proxy file uploads through the API server — always use the presigned URL flow.
- **Book deletion cascades.** Deleting a book deletes all its chapters. Warn the user before confirming.
- **Periods are manual.** There is no auto-creation of periods. An admin must create a new period each month and deactivate the previous one. Analytics are scoped to periods.
- **Subscription books array.** Each subscriber record contains an explicit `books` array controlling what that subscriber can access. Adding a book to the platform does not automatically make it accessible — it must be added to the relevant subscription's book list (this may require direct DB management or a future API endpoint).
- **Associates (`account === 1`)** can log in but most mutating endpoints check for `account === 2` and return 403. Build a limited view for associates if needed, but all book/chapter mutations will be rejected.
