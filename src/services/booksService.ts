import Repo from "../db/repository/booksRepository";
import seenService from "./seenService";
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
    userId: string = ""
  ): Promise<bookDTO> {
    try {
      const book = await Repo.fetchOne(bookId);
      if (book && userId)
        seenService.createNewSeen(book?._id as string, userId);
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
