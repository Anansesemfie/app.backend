# Admin Gaps — Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five new admin API route groups and one single-user endpoint to power the hollow admin dashboard pages (Hearth, Subscriptions, Revenue, Conversation) and the user detail page.

**Architecture:** Each new domain follows the identical pattern used everywhere in this codebase: Route file → Controller → Service class → Model imports from `db/models/index.ts`. All new routes mount under `REQUIREAUTH` in `src/api/routes/admin/index.ts`. No new Mongoose schemas — all data lives in existing collections (`Seen`, `Subscriber`, `Subscription`, `Comment`, `User`, `Book`).

**Tech Stack:** Node.js, Express, TypeScript, Mongoose, existing `CustomError` / `CustomErrorHandler` utilities, existing `sessionService` for admin auth checks.

---

## File Map

```
Created:
  src/api/routes/admin/DashboardRoute.ts
  src/api/routes/admin/SubscriptionsRoute.ts
  src/api/routes/admin/ConversationRoute.ts
  src/api/routes/admin/RevenueRoute.ts
  src/controllers/admin/dashboardController.ts
  src/controllers/admin/subscriptionsController.ts
  src/controllers/admin/conversationController.ts
  src/controllers/admin/revenueController.ts
  src/services/admin/dashboardService.ts
  src/services/admin/subscriptionsService.ts
  src/services/admin/conversationService.ts
  src/services/admin/revenueService.ts

Modified:
  src/api/routes/admin/index.ts          ← mount 4 new routers
  src/api/routes/admin/UserRoute.ts      ← add GET /:id
  src/controllers/admin/userController.ts ← add FetchUser export
```

---

## Task 1: Dashboard stats endpoint — `GET /admin/dashboard/stats`

**Files:**
- Create: `src/services/admin/dashboardService.ts`
- Create: `src/controllers/admin/dashboardController.ts`
- Create: `src/api/routes/admin/DashboardRoute.ts`
- Modify: `src/api/routes/admin/index.ts`

- [ ] **Step 1: Create `src/services/admin/dashboardService.ts`**

```typescript
import { Book, Subscriber, User } from "../../db/models";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";

class DashboardService {
  private async assertAdmin(token: string) {
    const { user } = await sessionService.getSession(token);
    if (!user || user.account !== UsersTypes.admin) {
      throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
    }
  }

  async getStats(token: string): Promise<{ users: number; books: number; activeSubscribers: number }> {
    await this.assertAdmin(token);
    const [users, books, activeSubscribers] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Subscriber.countDocuments({ active: true }),
    ]);
    return { users, books, activeSubscribers };
  }
}

export default new DashboardService();
```

- [ ] **Step 2: Create `src/controllers/admin/dashboardController.ts`**

```typescript
import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";
import dashboardService from "../../services/admin/dashboardService";

export const GetStats = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const stats = await dashboardService.getStats(token);
    res.status(200).json({ data: stats });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
```

- [ ] **Step 3: Create `src/api/routes/admin/DashboardRoute.ts`**

```typescript
import { Router } from "express";
import { GetStats } from "../../../controllers/admin/dashboardController";

const router = Router();

router.get("/stats", GetStats);

export default router;
```

- [ ] **Step 4: Mount in `src/api/routes/admin/index.ts`**

Add after the existing imports:
```typescript
import Dashboard from "./DashboardRoute";
```

Add after the existing `router.use` lines:
```typescript
router.use("/dashboard", REQUIREAUTH, Dashboard);
```

- [ ] **Step 5: Verify manually**

Start the dev server: `npm run dev`

```bash
# First get a token via login
TOKEN=$(curl -s -X POST http://localhost:3000/admin/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<admin_email>","password":"<admin_password>"}' | jq -r '.data.token')

curl -s http://localhost:3000/admin/dashboard/stats \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected:
```json
{ "data": { "users": 42, "books": 10, "activeSubscribers": 7 } }
```

- [ ] **Step 6: Commit**

```bash
git add src/services/admin/dashboardService.ts \
        src/controllers/admin/dashboardController.ts \
        src/api/routes/admin/DashboardRoute.ts \
        src/api/routes/admin/index.ts
git commit -m "feat(admin): add GET /admin/dashboard/stats endpoint"
```

---

## Task 2: Listening pulse endpoint — `GET /admin/dashboard/pulse?days=14`

**Files:**
- Modify: `src/services/admin/dashboardService.ts`
- Modify: `src/controllers/admin/dashboardController.ts`
- Modify: `src/api/routes/admin/DashboardRoute.ts`

- [ ] **Step 1: Add `getPulse` method to `src/services/admin/dashboardService.ts`**

Add this method inside the `DashboardService` class, after `getStats`:

```typescript
async getPulse(token: string, days: number): Promise<{ date: string; plays: number }[]> {
  await this.assertAdmin(token);

  const clampedDays = Math.min(Math.max(days, 1), 90);
  const since = new Date();
  since.setDate(since.getDate() - clampedDays);

  const raw: { _id: string; plays: number }[] = await (Seen as any).aggregate([
    { $match: { playedAt: { $exists: true, $not: { $size: 0 } } } },
    { $unwind: "$playedAt" },
    { $match: { playedAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$playedAt" } },
        plays: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const map = new Map(raw.map((r) => [r._id, r.plays]));
  const result: { date: string; plays: number }[] = [];
  for (let i = clampedDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, plays: map.get(key) ?? 0 });
  }
  return result;
}
```

Also add `Seen` to the import at the top of `dashboardService.ts`:
```typescript
import { Book, Subscriber, User, Seen } from "../../db/models";
```

- [ ] **Step 2: Add `GetPulse` to `src/controllers/admin/dashboardController.ts`**

```typescript
export const GetPulse = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const days = parseInt((req.query.days as string) ?? "14", 10) || 14;
    const pulse = await dashboardService.getPulse(token, days);
    res.status(200).json({ data: pulse });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
```

Also add `GetPulse` to the import in `DashboardRoute.ts`.

- [ ] **Step 3: Register route in `src/api/routes/admin/DashboardRoute.ts`**

```typescript
import { Router } from "express";
import { GetStats, GetPulse } from "../../../controllers/admin/dashboardController";

const router = Router();

router.get("/stats", GetStats);
router.get("/pulse", GetPulse);

export default router;
```

- [ ] **Step 4: Verify manually**

```bash
curl -s "http://localhost:3000/admin/dashboard/pulse?days=7" \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected: array of 7 objects `[{ "date": "2026-05-01", "plays": 0 }, ...]` — all 7 days present even if plays is 0.

- [ ] **Step 5: Commit**

```bash
git add src/services/admin/dashboardService.ts \
        src/controllers/admin/dashboardController.ts \
        src/api/routes/admin/DashboardRoute.ts
git commit -m "feat(admin): add GET /admin/dashboard/pulse endpoint"
```

---

## Task 3: Subscription stats — `GET /admin/subscriptions/stats`

**Files:**
- Create: `src/services/admin/subscriptionsService.ts`
- Create: `src/controllers/admin/subscriptionsController.ts`
- Create: `src/api/routes/admin/SubscriptionsRoute.ts`
- Modify: `src/api/routes/admin/index.ts`

- [ ] **Step 1: Create `src/services/admin/subscriptionsService.ts`**

```typescript
import { Subscriber, Subscription } from "../../db/models";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";

class AdminSubscriptionsService {
  private async assertAdmin(token: string) {
    const { user } = await sessionService.getSession(token);
    if (!user || user.account !== UsersTypes.admin) {
      throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
    }
  }

  async getStats(token: string) {
    await this.assertAdmin(token);

    const active = await Subscriber.countDocuments({ active: true });

    const grouped: { _id: string; count: number }[] = await (Subscriber as any).aggregate([
      { $match: { active: true } },
      { $group: { _id: "$parent", count: { $sum: 1 } } },
    ]);

    const planIds = grouped.map((g) => g._id);
    const plans = await Subscription.find({ _id: { $in: planIds } }, "name amount duration");

    const byPlan = grouped.map((g) => {
      const plan = plans.find((p: any) => p._id.toString() === g._id?.toString());
      return {
        name: plan ? (plan as any).name : "Unknown",
        count: g.count,
        amount: plan ? (plan as any).amount : 0,
      };
    });

    const recent = await (Subscriber as any)
      .find({ active: true })
      .sort({ activatedAt: -1 })
      .limit(20)
      .populate("user", "username email dp")
      .populate("parent", "name");

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

    return { active, byPlan, recent: recentFormatted };
  }
}

export default new AdminSubscriptionsService();
```

- [ ] **Step 2: Create `src/controllers/admin/subscriptionsController.ts`**

```typescript
import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";
import subscriptionsService from "../../services/admin/subscriptionsService";

export const GetStats = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const stats = await subscriptionsService.getStats(token);
    res.status(200).json({ data: stats });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
```

- [ ] **Step 3: Create `src/api/routes/admin/SubscriptionsRoute.ts`**

```typescript
import { Router } from "express";
import { GetStats } from "../../../controllers/admin/subscriptionsController";

const router = Router();

router.get("/stats", GetStats);

export default router;
```

- [ ] **Step 4: Mount in `src/api/routes/admin/index.ts`**

```typescript
import Subscriptions from "./SubscriptionsRoute";
// ...
router.use("/subscriptions", REQUIREAUTH, Subscriptions);
```

- [ ] **Step 5: Verify manually**

```bash
curl -s http://localhost:3000/admin/subscriptions/stats \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected:
```json
{
  "data": {
    "active": 5,
    "byPlan": [{ "name": "Monthly", "count": 3, "amount": 15 }],
    "recent": [{ "id": "...", "user": { "username": "...", "email": "...", "dp": "" }, "plan": "Monthly", "activatedAt": "..." }]
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/services/admin/subscriptionsService.ts \
        src/controllers/admin/subscriptionsController.ts \
        src/api/routes/admin/SubscriptionsRoute.ts \
        src/api/routes/admin/index.ts
git commit -m "feat(admin): add GET /admin/subscriptions/stats endpoint"
```

---

## Task 4: Conversation comments — `GET` + `DELETE /admin/conversation/comments`

**Files:**
- Create: `src/services/admin/conversationService.ts`
- Create: `src/controllers/admin/conversationController.ts`
- Create: `src/api/routes/admin/ConversationRoute.ts`
- Modify: `src/api/routes/admin/index.ts`

- [ ] **Step 1: Create `src/services/admin/conversationService.ts`**

```typescript
import { Comment } from "../../db/models";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";

class ConversationService {
  private async assertAdmin(token: string) {
    const { user } = await sessionService.getSession(token);
    if (!user || user.account !== UsersTypes.admin) {
      throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
    }
  }

  async getComments(
    token: string,
    { page = 1, limit = 20, bookId }: { page?: number; limit?: number; bookId?: string }
  ) {
    await this.assertAdmin(token);

    const filter: Record<string, any> = { deletedAt: { $exists: false } };
    if (bookId) filter.bookID = bookId;

    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      (Comment as any)
        .find(filter)
        .populate("bookID", "title")
        .populate("user", "username dp")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Comment.countDocuments(filter),
    ]);

    const formatted = results.map((c: any) => ({
      id: c._id,
      comment: c.comment,
      createdAt: c.createdAt,
      book: { id: c.bookID?._id, title: c.bookID?.title ?? "—" },
      user: { id: c.user?._id, username: c.user?.username ?? "—", dp: c.user?.dp ?? "" },
    }));

    return { results: formatted, total, page };
  }

  async deleteComment(token: string, id: string) {
    await this.assertAdmin(token);
    await Comment.findOneAndUpdate({ _id: id }, { deletedAt: new Date() });
    return "comment deleted";
  }
}

export default new ConversationService();
```

- [ ] **Step 2: Create `src/controllers/admin/conversationController.ts`**

```typescript
import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";
import conversationService from "../../services/admin/conversationService";

export const GetComments = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const page = parseInt(req.query.page as string ?? "1", 10) || 1;
    const limit = parseInt(req.query.limit as string ?? "20", 10) || 20;
    const bookId = req.query.bookId as string | undefined;
    const data = await conversationService.getComments(token, { page, limit, bookId });
    res.status(200).json({ data });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const DeleteComment = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const id = req.params.id;
    const result = await conversationService.deleteComment(token, id);
    res.status(200).json({ data: result });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
```

- [ ] **Step 3: Create `src/api/routes/admin/ConversationRoute.ts`**

```typescript
import { Router } from "express";
import { GetComments, DeleteComment } from "../../../controllers/admin/conversationController";

const router = Router();

router.get("/comments", GetComments);
router.delete("/comments/:id", DeleteComment);

export default router;
```

- [ ] **Step 4: Mount in `src/api/routes/admin/index.ts`**

```typescript
import Conversation from "./ConversationRoute";
// ...
router.use("/conversation", REQUIREAUTH, Conversation);
```

- [ ] **Step 5: Verify manually**

```bash
# List comments
curl -s "http://localhost:3000/admin/conversation/comments?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq

# Soft-delete a comment (replace <id> with a real comment _id)
curl -s -X DELETE "http://localhost:3000/admin/conversation/comments/<id>" \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected GET: `{ "data": { "results": [...], "total": 12, "page": 1 } }`
Expected DELETE: `{ "data": "comment deleted" }`

- [ ] **Step 6: Commit**

```bash
git add src/services/admin/conversationService.ts \
        src/controllers/admin/conversationController.ts \
        src/api/routes/admin/ConversationRoute.ts \
        src/api/routes/admin/index.ts
git commit -m "feat(admin): add GET/DELETE /admin/conversation/comments endpoints"
```

---

## Task 5: Revenue summary — `GET /admin/revenue/summary`

**Files:**
- Create: `src/services/admin/revenueService.ts`
- Create: `src/controllers/admin/revenueController.ts`
- Create: `src/api/routes/admin/RevenueRoute.ts`
- Modify: `src/api/routes/admin/index.ts`

- [ ] **Step 1: Create `src/services/admin/revenueService.ts`**

```typescript
import { Subscriber, Subscription } from "../../db/models";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";

class RevenueService {
  private async assertAdmin(token: string) {
    const { user } = await sessionService.getSession(token);
    if (!user || user.account !== UsersTypes.admin) {
      throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
    }
  }

  async getSummary(token: string) {
    await this.assertAdmin(token);

    const grouped: { _id: string; count: number }[] = await (Subscriber as any).aggregate([
      { $match: { active: true } },
      { $group: { _id: "$parent", count: { $sum: 1 } } },
    ]);

    const planIds = grouped.map((g) => g._id);
    const plans = await Subscription.find({ _id: { $in: planIds } }, "name amount duration");

    const byPlan = grouped.map((g) => {
      const plan = plans.find((p: any) => p._id.toString() === g._id?.toString());
      const amount = plan ? (plan as any).amount : 0;
      const duration = plan ? (plan as any).duration : 30;
      const monthlyRate = amount / (duration / 30);
      const contribution = Math.round(monthlyRate * g.count);
      return {
        name: plan ? (plan as any).name : "Unknown",
        amount,
        count: g.count,
        contribution,
      };
    });

    const mrr = byPlan.reduce((sum, p) => sum + p.contribution, 0);
    const totalActiveSubscribers = byPlan.reduce((sum, p) => sum + p.count, 0);

    return { mrr, totalActiveSubscribers, byPlan };
  }
}

export default new RevenueService();
```

- [ ] **Step 2: Create `src/controllers/admin/revenueController.ts`**

```typescript
import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";
import revenueService from "../../services/admin/revenueService";

export const GetSummary = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const summary = await revenueService.getSummary(token);
    res.status(200).json({ data: summary });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
```

- [ ] **Step 3: Create `src/api/routes/admin/RevenueRoute.ts`**

```typescript
import { Router } from "express";
import { GetSummary } from "../../../controllers/admin/revenueController";

const router = Router();

router.get("/summary", GetSummary);

export default router;
```

- [ ] **Step 4: Mount in `src/api/routes/admin/index.ts`**

```typescript
import Revenue from "./RevenueRoute";
// ...
router.use("/revenue", REQUIREAUTH, Revenue);
```

- [ ] **Step 5: Verify manually**

```bash
curl -s http://localhost:3000/admin/revenue/summary \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected:
```json
{
  "data": {
    "mrr": 225,
    "totalActiveSubscribers": 15,
    "byPlan": [{ "name": "Monthly", "amount": 15, "count": 15, "contribution": 225 }]
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/services/admin/revenueService.ts \
        src/controllers/admin/revenueController.ts \
        src/api/routes/admin/RevenueRoute.ts \
        src/api/routes/admin/index.ts
git commit -m "feat(admin): add GET /admin/revenue/summary endpoint"
```

---

## Task 6: Single user fetch — `GET /admin/user/:id`

**Files:**
- Modify: `src/controllers/admin/userController.ts`
- Modify: `src/api/routes/admin/UserRoute.ts`

- [ ] **Step 1: Add `FetchUser` to `src/controllers/admin/userController.ts`**

Add at the bottom of the file:

```typescript
export const FetchUser = async (req: Request, res: Response) => {
  try {
    const sessionId = res.locals.sessionId;
    const { user: sessionUser } = await (await import("../../services/sessionService")).default.getSession(sessionId);
    if (!sessionUser || sessionUser.account !== UsersTypes.admin) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const userId = req.params.id;
    const user = await userRepository.fetchUser(userId);
    if (!user) {
      throw new CustomError("User not found", "User not found", ErrorCodes.NOT_FOUND);
    }
    const formatted = await userService.formatUser(user);
    res.status(200).json({ data: formatted });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
```

Add the missing imports at the top of `userController.ts` (they may already be present — check first):
```typescript
import userRepository from "../../db/repository/userRepository";
import userService from "../../services/userService";
import { ErrorCodes } from "../../utils/CustomError";
```

- [ ] **Step 2: Register route in `src/api/routes/admin/UserRoute.ts`**

Add at the top:
```typescript
import { CreateUser, FetchUsers, FetchUser, LoginUser, MakeAssociate, SendEmail } from "../../../controllers/admin/userController";
```

Add route before `export default router`:
```typescript
router.get("/:id", REQUIREAUTH, FetchUser);
```

- [ ] **Step 3: Verify manually**

```bash
# Get a real user _id from the fetchUsers response first
USER_ID="<paste a user _id here>"

curl -s "http://localhost:3000/admin/user/${USER_ID}" \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected:
```json
{ "data": { "id": "...", "email": "...", "username": "...", "account": 0, "active": true, "dp": "", "bio": "" } }
```

- [ ] **Step 4: Commit**

```bash
git add src/controllers/admin/userController.ts \
        src/api/routes/admin/UserRoute.ts
git commit -m "feat(admin): add GET /admin/user/:id endpoint"
```

---

## Task 7: Final — verify `index.ts` is complete

- [ ] **Step 1: Confirm `src/api/routes/admin/index.ts` has all mounts**

The final file should look like this:

```typescript
import { Router, Request, Response } from "express";
import { PORT } from "../../../utils/env";
import { REQUIREAUTH } from "../../middlewares/CheckApp";

import Language from "./LanguageRoute";
import User from "./UserRoute";
import Book from "./BookRoute";
import Period from "./PeriodRoute";
import Org from "./OrgRoute";
import Dashboard from "./DashboardRoute";
import Subscriptions from "./SubscriptionsRoute";
import Conversation from "./ConversationRoute";
import Revenue from "./RevenueRoute";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Welcome to Anansesemfie Admin",
    endpoints: {
      staging: `http://localhost:${PORT}/`,
      production: "coming soon....",
    },
    version: "1.0",
  });
});

router.use("/language",      REQUIREAUTH, Language);
router.use("/user",          User);
router.use("/book",          REQUIREAUTH, Book);
router.use("/period",        REQUIREAUTH, Period);
router.use("/organization",  REQUIREAUTH, Org);
router.use("/dashboard",     REQUIREAUTH, Dashboard);
router.use("/subscriptions", REQUIREAUTH, Subscriptions);
router.use("/conversation",  REQUIREAUTH, Conversation);
router.use("/revenue",       REQUIREAUTH, Revenue);

export default router;
```

- [ ] **Step 2: Build TypeScript to verify no compile errors**

```bash
npm run build
```

Expected: no TypeScript errors. If errors appear, fix them — common causes are missing type imports or incorrect model property access patterns.

- [ ] **Step 3: Smoke test all 6 new endpoints**

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/admin/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<admin_email>","password":"<admin_password>"}' | jq -r '.data.token')

curl -s http://localhost:3000/admin/dashboard/stats      -H "Authorization: Bearer $TOKEN" | jq '.data | keys'
curl -s "http://localhost:3000/admin/dashboard/pulse?days=7" -H "Authorization: Bearer $TOKEN" | jq 'length'
curl -s http://localhost:3000/admin/subscriptions/stats  -H "Authorization: Bearer $TOKEN" | jq '.data | keys'
curl -s "http://localhost:3000/admin/conversation/comments?limit=3" -H "Authorization: Bearer $TOKEN" | jq '.data | keys'
curl -s http://localhost:3000/admin/revenue/summary      -H "Authorization: Bearer $TOKEN" | jq '.data | keys'
```

Each should return without a 401/403/500.

- [ ] **Step 4: Final commit**

```bash
git add src/api/routes/admin/index.ts
git commit -m "feat(admin): wire all new admin routes in index.ts"
```
