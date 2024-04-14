import { CommentType } from "../dto";
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
      console.log({ bookID, sessionID, comment });
      const session = await sessionService.getSession(sessionID);
      const newComment = await commentRepository.create({
        bookID,
        user: session?.user as string,
        comment,
      });
      return newComment;
    } catch (error: any) {
      throw error;
    }
  }

  public async getComments(bookId: string) {
    try {
      if (!bookId)
        throw await errorHandler.CustomError(ErrorEnum[403], "Invalid book ID");
      const comments = await commentRepository.getComments(bookId);
      return comments;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new CommentService();
