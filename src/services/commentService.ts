import commentRepository from "../db/repository/commentRepository";
import sessionService from "./sessionService";
import booksService from "./booksService";
import errorHandler, { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";

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
      const {session} = await sessionService.getSession(sessionID);
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

  public async getComments(bookId: string) {
    try {
      if (!bookId)
        throw await errorHandler.CustomError(ErrorEnum[403], "Invalid book ID");
      const comments = await commentRepository.getComments(bookId);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching all comments on book: ${bookId} @ ${HELPERS.currentTime()}`;
      return comments;
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
}

export default new CommentService();
