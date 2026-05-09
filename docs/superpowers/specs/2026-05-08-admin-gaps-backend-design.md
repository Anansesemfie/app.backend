# Admin Dashboard — Backend API Additions

**Date:** 2026-05-08
**Repo:** `audio_book` (Node.js / Express / TypeScript / MongoDB)
**Scope:** New admin API endpoints to power the admin dashboard pages that currently have no real data source.

---

## Goal

The existing backend exposes book CRUD, chapter CRUD, user management, period management, organisations, and languages. Several admin dashboard pages (Hearth, Subscriptions, Revenue, Conversation) have no backing endpoint and render mock data. This spec adds five new admin route groups plus one new single-user endpoint.

---

## Constraints

- All new routes follow the existing pattern: `Route → Controller → Service → Repository`
- All new admin routes mounted under `REQUIREAUTH` in `src/api/routes/admin/index.ts`
- Use existing Mongoose models — no new schemas required
- Errors thrown as `CustomError` instances, caught by `CustomErrorHandler.handle(error, res)` in each controller
- `sessionService.getSession(token)` used for auth, same as `bookService.ts`

---

## Architecture

```
src/
  api/routes/admin/
    DashboardRoute.ts        ← new
    SubscriptionsRoute.ts    ← new
    ConversationRoute.ts     ← new
    RevenueRoute.ts          ← new
    UserRoute.ts             ← add GET /:id

  controllers/admin/
    dashboardController.ts   ← new
    subscriptionsController.ts ← new
    conversationController.ts  ← new
    revenueController.ts     ← new

  services/admin/
    dashboardService.ts      ← new
    subscriptionsService.ts  ← new
    conversationService.ts   ← new
    revenueService.ts        ← new
```

Mount all new routes in `src/api/routes/admin/index.ts`:
```ts
router.use('/dashboard',      REQUIREAUTH, Dashboard)
router.use('/subscriptions',  REQUIREAUTH, Subscriptions)
router.use('/conversation',   REQUIREAUTH, Conversation)
router.use('/revenue',        REQUIREAUTH, Revenue)
```

---

## Endpoint 1 — Dashboard stats

```
GET /admin/dashboard/stats
Auth: Bearer token (admin only)
Response 200: { data: { users: number, books: number, activeSubscribers: number } }
```

**Service logic:**
```ts
const [users, books, activeSubscribers] = await Promise.all([
  User.countDocuments(),
  Book.countDocuments(),
  Subscriber.countDocuments({ active: true }),
])
return { users, books, activeSubscribers }
```

Validate that session user has `account === 2` (admin). Throw `CustomError` with `ErrorCodes.FORBIDDEN` if not.

---

## Endpoint 2 — Listening pulse (time-series)

```
GET /admin/dashboard/pulse?days=14
Auth: Bearer token (admin only)
Response 200: {
  data: [
    { date: "2026-04-25", plays: 42 },
    { date: "2026-04-26", plays: 58 },
    ...
  ]
}
```

**Service logic:**

The `Seen` collection stores a `playedAt: Date[]` array per user+book+period record. Aggregate across the entire collection:

```ts
const since = new Date()
since.setDate(since.getDate() - days)

const raw = await Seen.aggregate([
  { $match: { playedAt: { $exists: true, $not: { $size: 0 } } } },
  { $unwind: '$playedAt' },
  { $match: { playedAt: { $gte: since } } },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$playedAt' } },
      plays: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
])
```

Fill in zero-count days for the full N-day window so the chart always has N points:
```ts
const map = new Map(raw.map(r => [r._id, r.plays]))
const result = []
for (let i = days - 1; i >= 0; i--) {
  const d = new Date()
  d.setDate(d.getDate() - i)
  const key = d.toISOString().slice(0, 10)
  result.push({ date: key, plays: map.get(key) ?? 0 })
}
return result
```

`days` defaults to 14, max 90. Validate and clamp in the controller.

---

## Endpoint 3 — Subscription stats

```
GET /admin/subscriptions/stats
Auth: Bearer token (admin only)
Response 200: {
  data: {
    active: number,
    byPlan: [{ name: string, count: number, amount: number }],
    recent: [{ id, user: { username, email, dp }, plan: string, activatedAt: string }]
  }
}
```

**Service logic:**

```ts
// Active count
const active = await Subscriber.countDocuments({ active: true })

// Group by plan
const grouped = await Subscriber.aggregate([
  { $match: { active: true } },
  { $group: { _id: '$parent', count: { $sum: 1 } } },
])
// Populate plan names/amounts
const planIds = grouped.map(g => g._id)
const plans = await Subscription.find({ _id: { $in: planIds } }, 'name amount')
const byPlan = grouped.map(g => {
  const plan = plans.find(p => p._id.toString() === g._id.toString())
  return { name: plan?.name ?? 'Unknown', count: g.count, amount: plan?.amount ?? 0 }
})

// Recent 20 active subscribers
const recentDocs = await Subscriber.find({ active: true })
  .sort({ activatedAt: -1 })
  .limit(20)
  .populate('user', 'username email dp')
  .populate('parent', 'name')
const recent = recentDocs.map(s => ({
  id: s._id,
  user: { username: s.user?.username, email: s.user?.email, dp: s.user?.dp },
  plan: s.parent?.name ?? '—',
  activatedAt: s.activatedAt,
}))

return { active, byPlan, recent }
```

---

## Endpoint 4 — Conversation comments (paginated)

```
GET /admin/conversation/comments?page=1&limit=20&bookId=<optional>
Auth: Bearer token (admin only)
Response 200: {
  data: {
    results: [
      {
        id, comment, createdAt,
        book: { id, title },
        user: { id, username, dp }
      }
    ],
    total: number,
    page: number
  }
}
```

```
DELETE /admin/conversation/comments/:id
Auth: Bearer token (admin only)
Response 200: { data: "comment deleted" }
```

**Service logic (GET):**

```ts
const filter: any = { deletedAt: { $exists: false } }
if (bookId) filter.bookID = bookId

const [results, total] = await Promise.all([
  Comment.find(filter)
    .populate('bookID', 'title')
    .populate('user', 'username dp')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 }),
  Comment.countDocuments(filter),
])
```

**Service logic (DELETE):** `Comment.findOneAndUpdate({ _id: id }, { deletedAt: new Date() })`

---

## Endpoint 5 — Revenue summary

```
GET /admin/revenue/summary
Auth: Bearer token (admin only)
Response 200: {
  data: {
    mrr: number,
    totalActiveSubscribers: number,
    byPlan: [{ name, amount, count, contribution }]
  }
}
```

**Service logic:**

```ts
const grouped = await Subscriber.aggregate([
  { $match: { active: true } },
  { $group: { _id: '$parent', count: { $sum: 1 } } },
])
const planIds = grouped.map(g => g._id)
const plans = await Subscription.find({ _id: { $in: planIds } }, 'name amount duration')

const byPlan = grouped.map(g => {
  const plan = plans.find(p => p._id.toString() === g._id.toString())
  const monthlyAmount = plan ? plan.amount / (plan.duration / 30) : 0
  return {
    name: plan?.name ?? 'Unknown',
    amount: plan?.amount ?? 0,
    count: g.count,
    contribution: Math.round(monthlyAmount * g.count),
  }
})

const mrr = byPlan.reduce((sum, p) => sum + p.contribution, 0)
const totalActiveSubscribers = byPlan.reduce((sum, p) => sum + p.count, 0)
return { mrr, totalActiveSubscribers, byPlan }
```

**Caveat:** MRR is an estimate from active subscriber records. Actual Paystack payment receipts are not stored in the DB.

---

## Endpoint 6 — Single user fetch (addition to UserRoute)

```
GET /admin/user/:id
Auth: Bearer token (admin only)
Response 200: { data: UserResponse }
Response 404: { code: "NOT_FOUND", message: "User not found", status: 404 }
```

**Implementation:** Add `FetchUser` controller to `src/controllers/admin/userController.ts`. Calls `userRepository.fetchUser(id)` which already exists. Mount as `router.get('/:id', REQUIREAUTH, FetchUser)` in `UserRoute.ts`.

---

## Key business rules

- All endpoints check `account === 2` on the resolved session user. Throw `FORBIDDEN` if not.
- Revenue figures are estimates — document this clearly in the controller comment and API response.
- Soft-delete only for comments (`deletedAt` field) — never hard-delete user-generated content from the admin panel.
- `days` param on the pulse endpoint: default 14, max 90, clamp silently (no error for out-of-range).
