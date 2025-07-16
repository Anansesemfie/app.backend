import commentRepository from "../db/repository/commentRepository";
import sessionService from "./sessionService";
import booksService from "./booksService";
import userService from "./userService";
import periodService from "./periodService";

import { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";
import { CommentType, CommentResponse } from "../dto";
import CustomError, { ErrorCodes } from "../utils/CustomError";

class CommentService {
  private logInfo = "";
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
    const newComment = await commentRepository.create({
      bookID,
      user: session?.user as string,
      comment,
      period: period._id ?? "",
    });
    await booksService.updateBookMeta(bookID, {
      meta: "comments",
      action: "Plus",
    });
    return newComment;
  }

  public async getComments(bookId: string, params?: {}) {
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
    } catch (error: unknown) {}
  }
}

export default new CommentService();
