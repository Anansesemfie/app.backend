import commentRepository from "../db/repository/commentRepository";
import booksService from "./booksService";
import periodService from "./periodService";
import sessionService from "./sessionService";
import userService from "./userService";

import type { CommentResponse, CommentType } from "../dto";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";

class CommentService {
  public async createComment({
    bookID,
    sessionID,
    comment,
  }: {
    bookID: string;
    sessionID: string;
    comment: string;
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
    });
    await booksService.updateBookMeta(bookID, {
      meta: "comments",
      action: "Plus",
    });
    return newComment;
  }

  public async getComments(bookId: string, params?: Record<string, unknown>) {
    if (!bookId) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book ID",
        ErrorCodes.FORBIDDEN
      );
    }
    const comments = await commentRepository.getComments(bookId, params);
    return await Promise.all(
      comments.map((comment: CommentType) => this.formatComment(comment))
    );
  }

  private async formatComment(comment: CommentType) {
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
        };
        return formatted;
      }
    } catch {
      // user lookup failure should not surface to the caller
    }
  }
}

export default new CommentService();
