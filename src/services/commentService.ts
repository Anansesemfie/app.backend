import commentRepository from "../db/repository/commentRepository";
import booksService from "./booksService";
import periodService from "./periodService";
import sessionService from "./sessionService";
import userService from "./userService";

import type {
  CommentResponse,
  CommentType,
  PaginatedCommentsResponse,
  UserType,
} from "../dto";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";
import { UsersTypes } from "../db/models/utils";
import { sanitizeHtml } from "../utils/richText";

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
    if (!bookID || !sessionID || !comment) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book, user or comment",
        ErrorCodes.FORBIDDEN
      );
    }

    const sanitizedComment = sanitizeHtml(comment);
    if (!sanitizedComment) {
      throw new CustomError(
        ErrorEnum[400],
        "Comment cannot be empty or contain only invalid HTML",
        ErrorCodes.BAD_REQUEST
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
      comment: sanitizedComment,
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
    {
      page = 1,
      limit = 20,
      ...filters
    }: { page?: number; limit?: number } & Record<string, any> = {}
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
      commentRepository.getComments(bookId, { skip, limit, ...filters }),
      commentRepository.countComments(bookId, filters),
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

    const results = topLevel.map((comment: CommentType) => {
      const replyTypes = replyMap[String(comment._id)] ?? [];
      const formattedReplies = replyTypes
        .map((r) => this.formatComment(r))
        .filter(Boolean) as CommentResponse[];
      return this.formatComment(comment, formattedReplies);
    });

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
    const isOwner = String(comment.user) === String(user?._id);
    const isAdmin = user?.account === UsersTypes.admin;

    if (!isOwner && !isAdmin) {
      throw new CustomError(
        ErrorEnum[403],
        "You can only delete your own comments",
        ErrorCodes.FORBIDDEN
      );
    }

    const deletedAt = new Date();
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

  private formatComment(
    comment: CommentType,
    replies: CommentResponse[] = []
  ): CommentResponse | undefined {
    const user = comment.user as UserType;
    if (user && typeof user !== "string") {
      const formatted: CommentResponse = {
        id: String(comment._id),
        user: {
          id: String(user._id),
          name: user.username as string,
          picture: user.dp as string,
          email: user.email,
        },
        comment: comment.comment,
        createdAt: String(comment.createdAt),
        replies,
      };
      return formatted;
    }
    // Fallback if user is not populated or user is deleted
    return {
      id: String(comment._id),
      user: {
        id: typeof user === "string" ? user : "deleted",
        name: "Anonymous",
        picture: "",
        email: "",
      },
      comment: comment.comment,
      createdAt: String(comment.createdAt),
      replies,
    };
  }
}

export default new CommentService();
