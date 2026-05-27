# Book Comments & Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add paginated threaded comments, per-book stats endpoint, comment deletion, and per-book revenue admin endpoint to the Anansesemfie audio book platform.

**Architecture:** All changes follow the existing Route → Controller → Service → Repository → Model layering. `Books.meta` gains `likes`/`dislikes` fields missing from the Mongoose schema (service code already references them). `Comments` gains `parentId` for one-level reply threading. Revenue attribution uses full-plan-value per active subscriber — no equal split.

**Tech Stack:** Node.js, Express, TypeScript, Mongoose/MongoDB, dayjs, bson ObjectId

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Modify | `src/db/models/Books.ts` | Add `likes` + `dislikes` to `meta` schema |
| Modify | `src/db/models/Comments.ts` | Add `parentId` field |
| Modify | `src/dto/index.ts` | Add `parentId` to `CommentType`; add `replies` to `CommentResponse`; add `PaginatedCommentsResponse` type |
| Modify | `src/controllers/bookController.ts` | Add `getBookStats` handler |
| Modify | `src/api/routes/consumer/BookRoute.ts` | Add `GET /:bookId/stats` |
| Modify | `src/db/repository/commentRepository.ts` | Add pagination, `getReplies`, `countComments`, `findById`, `softDelete`, `softDeleteReplies` methods |
| Modify | `src/services/commentService.ts` | Paginated `getComments` with nested replies; `createComment` with optional `parentId`; `deleteComment` |
| Modify | `src/controllers/commentController.ts` | Update `getComments` for page/limit; add `postReply`, `deleteComment` |
| Modify | `src/api/routes/consumer/CommentRoute.ts` | Add reply POST + comment DELETE routes |
| Modify | `src/services/admin/revenueService.ts` | Add `getBookRevenue(bookId, token)` |
| Modify | `src/controllers/admin/revenueController.ts` | Add `GetBookRevenue` handler |
| Modify | `src/api/routes/admin/RevenueRoute.ts` | Add `GET /:bookId` route |

---

## Task 1: Fix `Books.meta` schema — add `likes` and `dislikes`

**Context:** `booksService.mutateBookMeta()` and `reactionService` already reference `book.meta.likes` and `book.meta.dislikes`, but the Mongoose schema in `Books.ts` never declares them. MongoDB silently ignores undeclared fields on write, so these values have never been persisted. The DTO type already has them. This task adds the two missing schema fields.

**Files:**
- Modify: `src/db/models/Books.ts`

- [ ] **Step 1: Add `likes` and `dislikes` to the `meta` block in `src/db/models/Books.ts`**

Replace the `meta` block (lines 68–81) with:

```ts
      meta: {
        played: {
          type: Number,
          default: 0,
        },
        views: {
          type: Number,
          default: 0,
        },
        comments: {
          type: Number,
          default: 0,
        },
        likes: {
          type: Number,
          default: 0,
        },
        dislikes: {
          type: Number,
          default: 0,
        },
      },
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: exits 0 with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/db/models/Books.ts dist/db/models/Books.js
git commit -m "fix: add likes and dislikes to Books.meta schema"
```

---

## Task 2: Add `parentId` to Comments model + update DTOs

**Context:** Replies reference their parent comment via `parentId`. One-level threading only — a reply's `parentId` must point to a top-level comment (`parentId = null`). The server enforces this on POST. We also extend `CommentType` and `CommentResponse` in `dto/index.ts` and add a `PaginatedCommentsResponse` type that Tasks 4–5 use.

**Files:**
- Modify: `src/db/models/Comments.ts`
- Modify: `src/dto/index.ts`

- [ ] **Step 1: Add `parentId` to `src/db/models/Comments.ts`**

Replace the entire file with:

```ts
import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";

const Comments = (Mongoose: any) => {
  return new Mongoose.Schema({
    bookID: {
      type: ObjectId,
      required: [true, "Missing book to comment on"],
    },
    user: {
      type: ObjectId,
      required: [true, "Missing user to comment on book"],
    },
    comment: {
      type: String,
      required: [true, "Comment is empty"],
      maxlength: [100, "Comment too long"],
    },
    period: {
      type: ObjectId,
      ref: "period",
      required: [true, "Period is required"],
    },
    parentId: {
      type: ObjectId,
      ref: "BookComments",
      required: false,
      default: null,
    },
    createdAt: {
      type: Date,
      default: HELPERS.currentTime(),
    },
    deletedAt: {
      type: String,
    },
  });
};

export default Comments;
```

- [ ] **Step 2: Update `CommentType` in `src/dto/index.ts`**

Replace the `CommentType` block (lines 199–207):

```ts
export type CommentType = {
  _id?: string;
  bookID: string;
  user: string;
  comment: string;
  period: string;
  parentId?: string | null;
  createdAt?: string;
  deletedAt?: string;
};
```

- [ ] **Step 3: Update `CommentResponse` in `src/dto/index.ts`**

Replace the `CommentResponse` block (lines 208–218):

```ts
export type CommentResponse = {
  id: string;
  user: {
    id: string;
    name: string;
    picture: string;
    email: string;
  };
  comment: string;
  createdAt?: string;
  replies?: CommentResponse[];
};
```

- [ ] **Step 4: Add `PaginatedCommentsResponse` type in `src/dto/index.ts`**

Add this new type immediately after the `CommentResponse` block:

```ts
export type PaginatedCommentsResponse = {
  page: number;
  limit: number;
  total: number;
  results: CommentResponse[];
};
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/db/models/Comments.ts src/dto/index.ts dist/db/models/Comments.js dist/dto/index.js
git commit -m "feat: add parentId to Comments model and extend CommentType/CommentResponse DTOs"
```

---

## Task 3: Expose `GET /book/:bookId/stats`

**Context:** `booksService.analyzeBook(bookId)` already exists and returns the `book.meta` object. No route exposes it. This task adds the controller handler and wires the route. The `/:bookId/stats` route is placed **before** `/:bookId` in the router file so Express doesn't confuse them (though technically they're different segment counts; ordering is defensive best practice).

**Files:**
- Modify: `src/controllers/bookController.ts`
- Modify: `src/api/routes/consumer/BookRoute.ts`

- [ ] **Step 1: Add `getBookStats` to `src/controllers/bookController.ts`**

Append this export at the bottom of the file:

```ts
export const getBookStats = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const stats = await booksService.analyzeBook(bookId);
    res.status(200).json({ data: stats });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
```

- [ ] **Step 2: Register route in `src/api/routes/consumer/BookRoute.ts`**

Replace the imports at the top with:

```ts
import { Router } from "express";
import {
  getBook,
  getBooks,
  filterBooks,
  getLikedBooksByUser,
  getBookStats,
} from "../../../controllers/bookController";
import { REQUIREAUTH } from "../../middlewares/CheckApp";
import Languages from "./LanguageRoute";
import Chapter from "./chapterRoute";
import Reaction from "./ReactionRoute";
import Category from "./CategoryRoute";
import Comment from "./CommentRoute";
```

Replace the route group (the four `router.get` lines at the bottom) with:

```ts
router.get("/", getBooks);
router.get("/:bookId/stats", getBookStats);
router.get("/:bookId", getBook);
router.get("/filter/all", filterBooks);
router.get("/liked/all", REQUIREAUTH, getLikedBooksByUser);
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Manual smoke test**

Start the server with `npm run dev`, then:

```bash
curl http://localhost:3000/book/<valid-book-id>/stats
```

Expected response:

```json
{
  "data": {
    "played": 0,
    "views": 0,
    "likes": 0,
    "dislikes": 0,
    "comments": 0
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/controllers/bookController.ts src/api/routes/consumer/BookRoute.ts dist/controllers/bookController.js dist/api/routes/consumer/BookRoute.js
git commit -m "feat: expose GET /book/:bookId/stats endpoint"
```

---

## Task 4: Paginate comments + nested replies + delete (service, repo, controller)

**Context:** This task rewrites three files together because they are tightly coupled. The repository gains pagination, reply fetching, and soft-delete helpers. The service gains `getComments` with page/limit + reply nesting, `createComment` with optional `parentId` (including depth validation), and `deleteComment` with ownership check + cascade. The controller gains updated `getComments` and new `postReply` / `deleteComment` handlers. Soft-deleted comments are filtered from all reads. Only top-level comments affect `book.meta.comments`.

**Files:**
- Modify: `src/db/repository/commentRepository.ts`
- Modify: `src/services/commentService.ts`
- Modify: `src/controllers/commentController.ts`

- [ ] **Step 1: Replace `src/db/repository/commentRepository.ts`**

```ts
import { Comment } from "../models";
import { ErrorEnum } from "../../utils/error";
import { CommentType } from "../../dto";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class CommentRepository {
  public async create(comment: CommentType): Promise<CommentType> {
    const newComment = await Comment.create(comment);
    return newComment;
  }

  public async findById(commentId: string): Promise<CommentType | null> {
    if (!commentId) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid comment ID",
        ErrorCodes.FORBIDDEN
      );
    }
    const comment = await Comment.findById(commentId);
    return comment;
  }

  public async countComments(bookId: string): Promise<number> {
    return Comment.countDocuments({
      bookID: bookId,
      parentId: null,
      deletedAt: null,
    });
  }

  public async getComments(
    bookId: string,
    { skip = 0, limit = 20 }: { skip?: number; limit?: number } = {}
  ): Promise<CommentType[]> {
    const comments = await Comment.find(
      { bookID: bookId, parentId: null, deletedAt: null }
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return comments;
  }

  public async getReplies(parentIds: string[]): Promise<CommentType[]> {
    if (!parentIds.length) return [];
    const replies = await Comment.find({
      parentId: { $in: parentIds },
      deletedAt: null,
    }).sort({ createdAt: 1 });
    return replies;
  }

  public async softDelete(commentId: string, deletedAt: string): Promise<void> {
    if (!commentId) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid comment ID",
        ErrorCodes.FORBIDDEN
      );
    }
    await Comment.findByIdAndUpdate(commentId, { deletedAt });
  }

  public async softDeleteReplies(
    parentId: string,
    deletedAt: string
  ): Promise<void> {
    if (!parentId) return;
    await Comment.updateMany({ parentId }, { deletedAt });
  }

  public async updateComment(
    commentId: string,
    comment: CommentType
  ): Promise<CommentType> {
    if (!commentId || !comment) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid comment ID or comment data",
        ErrorCodes.FORBIDDEN
      );
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      comment,
      { new: true }
    );
    return updatedComment;
  }
}

export default new CommentRepository();
```

- [ ] **Step 2: Replace `src/services/commentService.ts`**

```ts
import commentRepository from "../db/repository/commentRepository";
import booksService from "./booksService";
import periodService from "./periodService";
import sessionService from "./sessionService";
import userService from "./userService";

import type {
  CommentResponse,
  CommentType,
  PaginatedCommentsResponse,
} from "../dto";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";
import { UsersTypes } from "../db/models/utils";

class CommentService {
  public async createComment({
    bookID,
    sessionID,
    comment,
    parentId = null,
  }: {
    bookID: string;
    sessionID: string;
    comment: string;
    parentId?: string | null;
  }) {
    if (HELPERS.hasSpecialCharacters(comment)) {
      throw new CustomError(
        ErrorEnum[403],
        "Comment contains special characters",
        ErrorCodes.FORBIDDEN
      );
    }
    if (!bookID || !sessionID || !comment) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book, user or comment",
        ErrorCodes.FORBIDDEN
      );
    }

    if (parentId) {
      const parent = await commentRepository.findById(parentId);
      if (!parent) {
        throw new CustomError(
          ErrorEnum[404],
          "Parent comment not found",
          ErrorCodes.NOT_FOUND
        );
      }
      if (parent.parentId) {
        throw new CustomError(
          ErrorEnum[403],
          "Replies cannot be nested more than one level deep",
          ErrorCodes.FORBIDDEN
        );
      }
    }

    const { session } = await sessionService.getSession(sessionID);
    const period = await periodService.fetchLatest();
    if (!period) {
      throw new CustomError(
        ErrorEnum[404],
        "No active period found. Cannot create comment.",
        ErrorCodes.NOT_FOUND
      );
    }
    const newComment = await commentRepository.create({
      bookID,
      user: session?.user as string,
      comment,
      period: period._id as string,
      parentId,
    });

    // Only top-level comments increment the counter
    if (!parentId) {
      await booksService.updateBookMeta(bookID, {
        meta: "comments",
        action: "Plus",
      });
    }

    return newComment;
  }

  public async getComments(
    bookId: string,
    { page = 1, limit = 20 }: { page?: number; limit?: number } = {}
  ): Promise<PaginatedCommentsResponse> {
    if (!bookId) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book ID",
        ErrorCodes.FORBIDDEN
      );
    }

    const skip = (page - 1) * limit;
    const [topLevel, total] = await Promise.all([
      commentRepository.getComments(bookId, { skip, limit }),
      commentRepository.countComments(bookId),
    ]);

    const parentIds = topLevel.map((c: CommentType) => String(c._id));
    const allReplies = await commentRepository.getReplies(parentIds);

    // Group replies by parentId string key
    const replyMap: Record<string, CommentType[]> = {};
    for (const reply of allReplies) {
      const key = String(reply.parentId);
      if (!replyMap[key]) replyMap[key] = [];
      replyMap[key].push(reply);
    }

    const results = await Promise.all(
      topLevel.map(async (comment: CommentType) => {
        const replyTypes = replyMap[String(comment._id)] ?? [];
        const formattedReplies = (
          await Promise.all(replyTypes.map((r) => this.formatComment(r)))
        ).filter(Boolean) as CommentResponse[];
        return this.formatComment(comment, formattedReplies);
      })
    );

    return {
      page,
      limit,
      total,
      results: results.filter(Boolean) as CommentResponse[],
    };
  }

  public async deleteComment(
    commentId: string,
    sessionID: string
  ): Promise<void> {
    if (!commentId || !sessionID) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid comment ID or session",
        ErrorCodes.FORBIDDEN
      );
    }

    const comment = await commentRepository.findById(commentId);
    if (!comment || comment.deletedAt) {
      throw new CustomError(
        ErrorEnum[404],
        "Comment not found",
        ErrorCodes.NOT_FOUND
      );
    }

    const { user } = await sessionService.getSession(sessionID);
    const isOwner = String(comment.user) === String(user._id);
    const isAdmin = user.account === UsersTypes.admin;

    if (!isOwner && !isAdmin) {
      throw new CustomError(
        ErrorEnum[403],
        "You can only delete your own comments",
        ErrorCodes.FORBIDDEN
      );
    }

    const deletedAt = HELPERS.currentTime() as string;
    await commentRepository.softDelete(commentId, deletedAt);

    // Cascade soft-delete replies and decrement counter only for top-level
    if (!comment.parentId) {
      await commentRepository.softDeleteReplies(commentId, deletedAt);
      await booksService.updateBookMeta(comment.bookID, {
        meta: "comments",
        action: "Minus",
      });
    }
  }

  private async formatComment(
    comment: CommentType,
    replies: CommentResponse[] = []
  ): Promise<CommentResponse | undefined> {
    try {
      const user = await userService.fetchUser(comment.user);
      if (user) {
        const formatted: CommentResponse = {
          id: comment._id as string,
          user: {
            id: user._id as string,
            name: user.username as string,
            picture: user.dp as string,
            email: user.email,
          },
          comment: comment.comment,
          createdAt: comment.createdAt,
          replies,
        };
        return formatted;
      }
    } catch {
      // user lookup failure should not surface to the caller
    }
  }
}

export default new CommentService();
```

- [ ] **Step 3: Replace `src/controllers/commentController.ts`**

```ts
import { CustomErrorHandler } from "../utils/CustomError";
import commentService from "../services/commentService";
import { Request, Response } from "express";

export const postComment = async (req: Request, res: Response) => {
  try {
    const { bookId, comment } = req.body;
    const sessionID = res.locals.sessionId;
    const newComment = await commentService.createComment({
      comment,
      sessionID,
      bookID: bookId,
    });
    res.status(201).json({ data: newComment });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const comments = await commentService.getComments(bookId, { page, limit });
    res.status(200).json({ data: comments });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const postReply = async (req: Request, res: Response) => {
  try {
    const parentId = req.params.commentId;
    const { bookId, comment } = req.body;
    const sessionID = res.locals.sessionId;
    const newReply = await commentService.createComment({
      comment,
      sessionID,
      bookID: bookId,
      parentId,
    });
    res.status(201).json({ data: newReply });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const sessionID = res.locals.sessionId;
    await commentService.deleteComment(commentId, sessionID);
    res.status(200).json({ data: { message: "Comment deleted successfully" } });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/db/repository/commentRepository.ts src/services/commentService.ts src/controllers/commentController.ts dist/db/repository/commentRepository.js dist/services/commentService.js dist/controllers/commentController.js
git commit -m "feat: paginated comments with nested replies, reply creation, and soft-delete"
```

---

## Task 5: Wire comment reply and delete routes

**Context:** The controller handlers `postReply` and `deleteComment` were written in Task 4. This task only wires the routes.

**Files:**
- Modify: `src/api/routes/consumer/CommentRoute.ts`

- [ ] **Step 1: Replace `src/api/routes/consumer/CommentRoute.ts`**

```ts
import {
  getComments,
  postComment,
  postReply,
  deleteComment,
} from "../../../controllers/commentController";
import { REQUIREAUTH } from "../../middlewares/CheckApp";
import { Router } from "express";

const router = Router();

router.post("/", REQUIREAUTH, postComment);
router.get("/:bookId", getComments);
router.post("/:commentId/reply", REQUIREAUTH, postReply);
router.delete("/:commentId", REQUIREAUTH, deleteComment);

export default router;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Manual smoke test — paginated GET**

```bash
curl "http://localhost:3000/book/comment/<bookId>?page=1&limit=5"
```

Expected:
```json
{
  "data": {
    "page": 1,
    "limit": 5,
    "total": 3,
    "results": [
      {
        "id": "...",
        "user": { "id": "...", "name": "Kwame", "picture": "...", "email": "..." },
        "comment": "Great chapter!",
        "createdAt": "2026-05-20T12:00:00.000Z",
        "replies": []
      }
    ]
  }
}
```

- [ ] **Step 4: Manual smoke test — post a reply**

```bash
curl -X POST http://localhost:3000/book/comment/<commentId>/reply \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"bookId":"<bookId>","comment":"Same here"}'
```

Expected: 201 with the new reply document.

- [ ] **Step 5: Manual smoke test — reject nested reply**

Try replying to the reply ID from Step 4:

```bash
curl -X POST http://localhost:3000/book/comment/<replyId>/reply \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"bookId":"<bookId>","comment":"Nested"}'
```

Expected: `403` with message `"Replies cannot be nested more than one level deep"`.

- [ ] **Step 6: Manual smoke test — delete own comment**

```bash
curl -X DELETE http://localhost:3000/book/comment/<commentId> \
  -H "Authorization: Bearer <token>"
```

Expected: `200` with `{"data":{"message":"Comment deleted successfully"}}`.

Then re-fetch GET comments — the deleted comment and its replies should not appear.

- [ ] **Step 7: Manual smoke test — delete someone else's comment (non-admin)**

```bash
curl -X DELETE http://localhost:3000/book/comment/<otherUsersCommentId> \
  -H "Authorization: Bearer <different-user-token>"
```

Expected: `403` with message `"You can only delete your own comments"`.

- [ ] **Step 8: Commit**

```bash
git add src/api/routes/consumer/CommentRoute.ts dist/api/routes/consumer/CommentRoute.js
git commit -m "feat: wire POST /:commentId/reply and DELETE /:commentId comment routes"
```

---

## Task 6: Per-book revenue endpoint for admin and publisher

**Context:** The existing `GET /admin/revenue/summary` is platform-wide. This adds `GET /admin/revenue/:bookId` (mounted via the existing `REQUIREAUTH` guard on the revenue router). Admin gets full breakdown grouped by subscriber's `activatedAt` year-month. A user whose `organization` matches the book's `organization` gets totals only. All others get 403. Revenue = sum of full plan `amount` per active subscriber that has the book in their `books` array (full-attribution model).

**Files:**
- Modify: `src/services/admin/revenueService.ts`
- Modify: `src/controllers/admin/revenueController.ts`
- Modify: `src/api/routes/admin/RevenueRoute.ts`

- [ ] **Step 1: Replace `src/services/admin/revenueService.ts`**

```ts
import dayjs from "dayjs";
import { Book, Subscriber, Subscription } from "../../db/models";
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

    const grouped: { _id: string; count: number }[] = await (
      Subscriber as any
    ).aggregate([
      { $match: { active: true } },
      { $group: { _id: "$parent", count: { $sum: 1 } } },
    ]);

    const planIds = grouped.map((g) => g._id);
    const plans = await Subscription.find(
      { _id: { $in: planIds } },
      "name amount duration"
    );

    const byPlan = grouped.map((g) => {
      const plan = plans.find(
        (p: any) => p._id.toString() === g._id?.toString()
      );
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

  async getBookRevenue(bookId: string, token: string) {
    const { user } = await sessionService.getSession(token);
    const isAdmin = user.account === UsersTypes.admin;

    if (!isAdmin) {
      if (!user.organization) {
        throw new CustomError(
          ErrorEnum[403],
          "Forbidden",
          ErrorCodes.FORBIDDEN
        );
      }
      const book = await Book.findById(bookId, "organization");
      if (
        !book ||
        String((book as any).organization) !== String(user.organization)
      ) {
        throw new CustomError(
          ErrorEnum[403],
          "Forbidden",
          ErrorCodes.FORBIDDEN
        );
      }
    }

    // Active subscribers whose subscription includes this book
    const subscribers = await (Subscriber as any)
      .find({ active: true, books: bookId })
      .populate("parent", "amount duration name");

    let totalRevenue = 0;
    const totalSubscribers: number = subscribers.length;

    for (const sub of subscribers) {
      const plan = sub.parent as any;
      if (plan && plan.amount) {
        totalRevenue += plan.amount;
      }
    }

    if (!isAdmin) {
      return { totalRevenue, totalSubscribers };
    }

    // Admin: full breakdown grouped by activatedAt year-month
    const periodMap: Record<
      string,
      { period: string; subscribers: number; revenue: number }
    > = {};

    for (const sub of subscribers) {
      const plan = sub.parent as any;
      const activatedAt = sub.activatedAt as Date | undefined;
      const periodKey = activatedAt
        ? dayjs(activatedAt).format("YYYY-MM")
        : "unknown";

      if (!periodMap[periodKey]) {
        periodMap[periodKey] = {
          period: periodKey,
          subscribers: 0,
          revenue: 0,
        };
      }
      periodMap[periodKey].subscribers++;
      if (plan && plan.amount) {
        periodMap[periodKey].revenue += plan.amount;
      }
    }

    const byPeriod = Object.values(periodMap).sort((a, b) =>
      a.period.localeCompare(b.period)
    );

    return { totalRevenue, totalSubscribers, byPeriod };
  }
}

export default new RevenueService();
```

- [ ] **Step 2: Replace `src/controllers/admin/revenueController.ts`**

```ts
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

export const GetBookRevenue = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const bookId = req.params.bookId;
    const revenue = await revenueService.getBookRevenue(bookId, token);
    res.status(200).json({ data: revenue });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
```

- [ ] **Step 3: Replace `src/api/routes/admin/RevenueRoute.ts`**

```ts
import { Router } from "express";
import {
  GetSummary,
  GetBookRevenue,
} from "../../../controllers/admin/revenueController";

const router = Router();

router.get("/summary", GetSummary);
router.get("/:bookId", GetBookRevenue);

export default router;
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 5: Manual smoke test — admin full breakdown**

```bash
curl http://localhost:3000/admin/revenue/<valid-book-id> \
  -H "Authorization: Bearer <admin-token>"
```

Expected:
```json
{
  "data": {
    "totalRevenue": 45000,
    "totalSubscribers": 2,
    "byPeriod": [
      { "period": "2026-05", "subscribers": 2, "revenue": 45000 }
    ]
  }
}
```

- [ ] **Step 6: Manual smoke test — regular user without org (should 403)**

```bash
curl http://localhost:3000/admin/revenue/<bookId> \
  -H "Authorization: Bearer <regular-user-token>"
```

Expected: `403 Forbidden`.

- [ ] **Step 7: Commit**

```bash
git add src/services/admin/revenueService.ts src/controllers/admin/revenueController.ts src/api/routes/admin/RevenueRoute.ts dist/services/admin/revenueService.js dist/controllers/admin/revenueController.js dist/api/routes/admin/RevenueRoute.js
git commit -m "feat: add GET /admin/revenue/:bookId per-book revenue endpoint"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Covered in |
|---|---|
| Fix `Books.meta` — add `likes`, `dislikes` | Task 1 |
| Add `parentId` to `Comments` schema | Task 2 |
| Add `parentId` to `CommentType` DTO | Task 2 |
| `GET /book/:bookId/stats` (public) | Task 3 |
| Paginate `GET /book/comment/:bookId` (page + limit) | Task 4 + 5 |
| Only top-level comments at root level | Task 4 (repo `parentId: null` filter) |
| Replies nested under each comment | Task 4 (service grouping) |
| `total` = `countDocuments({ parentId: null })` | Task 4 (repo `countComments`) |
| `POST /book/comment/:commentId/reply` | Task 4 (service/controller) + Task 5 (route) |
| Validate max 1 level deep | Task 4 (service `createComment`) |
| Replies do NOT increment `book.meta.comments` | Task 4 (service `createComment`) |
| `DELETE /book/comment/:commentId` (auth required) | Task 4 (service/controller) + Task 5 (route) |
| Owner or admin can delete | Task 4 (service `deleteComment`) |
| Deleting parent soft-deletes replies | Task 4 (service → `softDeleteReplies`) |
| Deleting top-level decrements `book.meta.comments` | Task 4 (service `deleteComment`) |
| `GET /admin/revenue/:bookId` admin full breakdown | Task 6 |
| Publisher sees totals only, scoped to org | Task 6 |
| Non-org users get 403 | Task 6 |

### Placeholder scan

No TBD, TODO, or placeholder text found in any task.

### Type consistency

- `PaginatedCommentsResponse` defined in Task 2 (dto), imported in Task 4 (service) ✓
- `CommentResponse.replies?: CommentResponse[]` defined in Task 2, populated in Task 4 ✓
- `CommentType.parentId?: string | null` defined in Task 2, used in Task 4 ✓
- `commentRepository.softDelete(id, deletedAt)` signature matches all call sites ✓
- `commentRepository.softDeleteReplies(parentId, deletedAt)` signature matches all call sites ✓
- `revenueService.getBookRevenue(bookId, token)` matches `GetBookRevenue` controller call ✓
- `commentService.deleteComment(commentId, sessionID)` matches controller call ✓
