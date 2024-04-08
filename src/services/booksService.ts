import Repo from "../db/repository/booksRepository";
import seenService from "./seenService";
import userService from "./userService";
import sessionService from "./sessionService";

import { bookDTO } from "../dto";
import HELPERS from "../utils/helpers";

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
      throw new Error(error);
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
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}

export default new BookService();
