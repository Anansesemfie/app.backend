import Repo from "../db/repository/booksRepository";
import seenService from "./seenService";
import userService from "./userService";
import sessionService from "./sessionService";

import { bookDTO, bookUpdateDTO } from "../dto";
import HELPERS from "../utils/helpers";
import errorHandler, { ErrorEnum } from "../utils/error";

class BookService {
  private logInfo = "";
  public async fetchBooks(): Promise<bookDTO[]> {
    try {
      const books = await Repo.fetchAll();
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching books @ ${HELPERS.currentTime()}`;
      return books;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching books @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async fetchBook(
    bookId: string,
    sessionId: string = ""
  ): Promise<bookDTO> {
    try {
      if (!bookId)
        throw await errorHandler.CustomError(ErrorEnum[403], "Invalid book ID");
      const book = await Repo.fetchOne(bookId);
      if (sessionId) {
        // check for seen record or create seen record
        const session = await sessionService.getSession(sessionId);
        const user = await userService.fetchUser(session.user as string);
        await seenService.createNewSeen(book?._id as string, sessionId);
      }

      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching book @ ${HELPERS.currentTime()}`;
      return book;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching book @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
  public async updateBook(
    bookID: string,
    book: bookUpdateDTO
  ): Promise<bookDTO> {
    try {
      if (!bookID) {
        throw await errorHandler.CustomError(ErrorEnum[403], "Invalid book ID");
      }
      const updatedBook = await Repo.update(bookID, book);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } updating book @ ${HELPERS.currentTime()}`;
      return updatedBook;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } updating book @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}

export default new BookService();
