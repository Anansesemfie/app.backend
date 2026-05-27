# Spec: Book Comments & Stats

**Date:** 2026-05-27  
**Branch:** fix/period-flow-bugs (target: main)

---

## 1. Context — What Already Exists

The codebase already has substantial plumbing in place. The work is mostly about fixing gaps and wiring things up, not starting from scratch.

| Layer | Status |
|---|---|
| `Comments` Mongoose model | ✅ Exists — `bookID`, `user`, `comment`, `period`, `deletedAt` |
| `Reaction` Mongoose model | ✅ Exists — `bookID`, `user`, `action ("Like")`, `period` |
| `Seen` model (play tracking) | ✅ Exists — `playedAt: [Date]`, `bookID`, `user`, `period` |
| `Book.meta` (aggregated counters) | ⚠️ Partial — `played`, `views`, `comments` exist but **`likes` and `dislikes` are missing from the schema** |
| `booksService.analyzeBook(bookId)` | ✅ Exists — returns `book.meta` but **no route exposes it** |
| `GET /book/comment/:bookId` | ✅ Exists — public, returns flat comments list — **no pagination** |
| `POST /book/comment` | ✅ Exists — auth required |
| `POST /book/reaction/like/:bookId` | ✅ Exists |
| `POST /book/reaction/dislike/:bookId` | ✅ Exists |
| Per-book revenue endpoint | ❌ Missing — `revenueService.getSummary()` is platform-wide only |
| Threaded comment replies | ❌ Missing — Comments schema is flat |
| Comment pagination | ❌ Missing — `commentRepository.getComments()` has no skip/limit |

---

## 2. Goals

1. Expose an existing `analyzeBook()` method as a proper `GET /book/:bookId/stats` endpoint
2. Fix the `Books.meta` schema to include `likes` and `dislikes`
3. Add offset-based pagination to `GET /book/comment/:bookId`
4. Add one-level-deep reply threading to comments (`parentId` field)
5. Add user-delete on own comments (`DELETE /book/comment/:commentId`)
6. Add per-book revenue stats for admin (full) and publisher (totals only)

---

## 3. Data Model Changes

### 3.1 Fix `Books.meta` — add `likes` & `dislikes`

**File:** `src/db/models/Books.ts`

Add to the `meta` embedded object:
```ts
likes: { type: Number, default: 0 },
dislikes: { type: Number, default: 0 },
```

These fields are already referenced in `booksService.mutateBookMeta()` and `reactionService` — the schema just never declared them.

---

### 3.2 Add `parentId` to `Comments` model

**File:** `src/db/models/Comments.ts`

Add optional field:
```ts
parentId: {
  type: ObjectId,
  ref: "comments",
  required: false,
  default: null,
}
```

Rules:
- Top-level comments: `parentId = null`
- Replies: `parentId = <parent comment _id>`
- **No nesting beyond one level** — if `parentId` is supplied, validate that the referenced comment also has `parentId = null` (server-enforced)

---

## 4. API Changes

### 4.1 New: `GET /book/:bookId/stats` — Book Stats

**Auth:** Public (no token required)

**Response:**
```json
{
  "data": {
    "played": 412,
    "views": 1023,
    "likes": 88,
    "dislikes": 4,
    "comments": 37
  }
}
```

**Implementation:**
- Controller: `bookController.ts` — add `getBookStats`
- Service: `booksService.analyzeBook(bookId)` already exists — just wire it up
- Route: `router.get('/:bookId/stats', getBookStats)` in `BookRoute.ts`

> Stats are pre-aggregated on `Book.meta` and updated atomically on each relevant event (like/dislike/comment creation). No live aggregation needed.

---

### 4.2 Update: `GET /book/comment/:bookId` — Paginated Comments

**Auth:** Public

**Query params:**
| Param | Type | Default |
|---|---|---|
| `page` | number | 1 |
| `limit` | number | 20 |

**Response:**
```json
{
  "data": {
    "page": 1,
    "limit": 20,
    "total": 37,
    "results": [
      {
        "id": "abc123",
        "user": { "id": "...", "name": "Kwame", "picture": "...", "email": "..." },
        "comment": "Loved this chapter!",
        "createdAt": "2026-05-20T12:00:00Z",
        "replies": [
          {
            "id": "def456",
            "user": { "id": "...", "name": "Ama", "picture": "...", "email": "..." },
            "comment": "Same here!",
            "createdAt": "2026-05-20T13:00:00Z"
          }
        ]
      }
    ]
  }
}
```

**Notes:**
- Only top-level comments (`parentId = null`) are returned at the top level
- Replies are nested under each comment — fetched in a second query per page
- `total` comes from `Comment.countDocuments({ bookID, parentId: null })`

**Repository changes needed:**
- `commentRepository.getComments()` — add `skip`/`limit` and filter by `parentId: null`
- `commentRepository.getReplies(parentId)` — new method, returns replies for a list of comment IDs

**Service changes needed:**
- `commentService.getComments()` — accept `page`/`limit`, fetch top-level, then fetch replies and nest them

---

### 4.3 New: `POST /book/comment/:commentId/reply` — Reply to Comment

**Auth:** Required (Bearer token)

**Body:**
```json
{ "comment": "Great point!" }
```

**Implementation:**
- Reuses `commentService.createComment()` — add `parentId` param
- Validate that `parentId` references a top-level comment (no nesting beyond 1 level)
- Does NOT increment `book.meta.comments` for replies (only top-level comments count)
- Controller: add `postReply` to `commentController.ts`
- Route: `router.post('/:commentId/reply', REQUIREAUTH, postReply)` in `CommentRoute.ts`

---

### 4.4 New: `DELETE /book/comment/:commentId` — Delete Comment

**Auth:** Required (Bearer token)

**Rules:**
- User can delete their own comments only
- Admin can delete any comment
- Deleting a parent comment also soft-deletes its replies (set `deletedAt`)
- Decrements `book.meta.comments` by 1 (replies don't affect the counter)

**Implementation:**
- `commentService.deleteComment(commentId, sessionId)` — new method
- Fetch comment, verify `comment.user === session.user` OR `session.user.account === admin`
- Soft-delete: set `deletedAt = HELPERS.currentTime()`
- Controller: add `deleteComment` to `commentController.ts`
- Route: `router.delete('/:commentId', REQUIREAUTH, deleteComment)` in `CommentRoute.ts`

---

### 4.5 New: `GET /book/:bookId/revenue` — Per-Book Revenue (Admin + Publisher)

**Auth:** Required

**Access rules:**
- Admin: full breakdown (subscribers per period, MRR contribution)
- Publisher: totals only (no per-user data) — scoped to books in their `organization`

**Response (admin):**
```json
{
  "data": {
    "totalRevenue": 450000,
    "totalSubscribers": 90,
    "byPeriod": [
      { "period": "2026-05", "subscribers": 45, "revenue": 225000 }
    ]
  }
}
```

**Response (publisher/org owner):**
```json
{
  "data": {
    "totalRevenue": 450000,
    "totalSubscribers": 90
  }
}
```

**Implementation notes:**
- Books belong to an `organization`. Subscribers are linked to `Subscription` plans, not individual books.
- Revenue attribution: a subscriber's plan covers a set of books. Revenue is split equally across books in the plan, OR the full plan revenue is attributed if the book is the only one in the plan.
- This likely requires a new `admin/revenueService.getBookRevenue(bookId, token)` method.
- Route: `GET /admin/books/:bookId/revenue` (admin router, not consumer)

> ⚠️ **Open question for implementation:** Revenue attribution model needs clarification — equal split vs. full attribution. Default to full attribution (entire subscriber plan revenue counts toward each book they accessed).

---

## 5. Implementation Order

| Step | Task | Files touched |
|---|---|---|
| 1 | Fix `Books.meta` schema (add `likes`, `dislikes`) | `src/db/models/Books.ts` |
| 2 | Add `parentId` to `Comments` schema | `src/db/models/Comments.ts` |
| 3 | Wire `GET /book/:bookId/stats` | `src/controllers/bookController.ts`, `src/api/routes/consumer/BookRoute.ts` |
| 4 | Paginate `GET /book/comment/:bookId` | `src/db/repository/commentRepository.ts`, `src/services/commentService.ts`, `src/controllers/commentController.ts` |
| 5 | Add reply threading (POST + nested GET) | `src/db/repository/commentRepository.ts`, `src/services/commentService.ts`, `src/controllers/commentController.ts`, `src/api/routes/consumer/CommentRoute.ts` |
| 6 | Add `DELETE /book/comment/:commentId` | same comment files |
| 7 | Add per-book revenue admin endpoint | `src/services/admin/revenueService.ts`, `src/controllers/admin/revenueController.ts`, `src/api/routes/admin/RevenueRoute.ts` |

---

## 6. Not In Scope

- Per-chapter comments (book-level only)
- Comment editing (delete-only per user decision)
- User flagging / report workflow
- Real-time comment feeds (WebSocket/SSE)
- Cursor-based pagination (offset is fine for now)
