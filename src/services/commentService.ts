import commentRepository from "../db/repository/commentRepository";
import sessionService from "./sessionService";
import booksService from "./booksService";
import userService from "./userService";

import errorHandler, { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";
import { CommentType, CommentResponse } from "../dto";

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
    try {
      if (HELPERS.hasSpecialCharacters(comment)) {
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Comment contains special characters"
        );
      }
      if (!bookID || !sessionID || !comment) {
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Invalid book, user or comment"
        );
      }
      const { session } = await sessionService.getSession(sessionID);
      const newComment = await commentRepository.create({
        bookID,
        user: session?.user as string,
        comment,
      });
      await booksService.updateBookMeta(bookID, {
        meta: "comments",
        action: "Plus",
      });
      this.logInfo = `${HELPERS.loggerInfo.success} ${
        session?.user
      } commented on book: ${bookID} @ ${HELPERS.currentTime()}`;
      return newComment;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } user with session: ${sessionID} commented on book: ${bookID} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async getComments(bookId: string, params?: {}) {
    try {
      if (!bookId)
        throw await errorHandler.CustomError(ErrorEnum[403], "Invalid book ID");
      const comments = await commentRepository.getComments(bookId, params);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching all comments on book: ${bookId} @ ${HELPERS.currentTime()}`;
      return await Promise.all(
        comments.map((comment: CommentType) => this.formatComment(comment))
      );
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching all comments on book: ${bookId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
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
