import Repo from "../db/repository/booksRepository";
import seenService from "./seenService";
import sessionService from "./sessionService";
import chapterService from "./chapterService";
import languageService from "./languageService";
import categoryService from "./categoryService";

import { BookType, BookUpdateType } from "../dto";
import HELPERS from "../utils/helpers";
import errorHandler, { ErrorEnum } from "../utils/error";

class BookService {
  private logInfo = "";
  public async fetchBooks(): Promise<BookType[]> {
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

  public async fetchBook(bookId: string, sessionId: string = ""): Promise<BookType> {
    if (!bookId) {
      throw await errorHandler.CustomError(ErrorEnum[403], "Invalid book ID");
    }

    const book = await Repo.fetchOne(bookId);

    if (sessionId) {
      const session = await sessionService.getSession(sessionId);

      if (!session) {
        throw await errorHandler.CustomError(ErrorEnum[403], "Invalid Session ID");
      }

      await seenService.createNewSeen(book?._id as string, session.user as string);
    }

    this.logInfo = `${HELPERS.loggerInfo.success} fetching book @ ${HELPERS.currentTime()}`;
    return book;
  }
  public async updateBook(
    bookID: string,
    book: BookUpdateType
  ): Promise<BookType> {
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

  public async updateBookMeta(
    bookId: string,
    metaAction: { meta: string; action: "Plus" | "Minus" }
  ) {
    try {
      const book = await this.fetchBook(bookId);
      const newMeta = await this.mutateBookMeta(
        book?.meta as {
          played: number;
          views: number;
          likes: number;
          dislikes: number;
          comments: number;
        },
        metaAction
      );
      book.meta = newMeta;
      await this.updateBook(bookId, book);
    } catch (error) {
      throw await errorHandler.CustomError(ErrorEnum[500], "Invalid action");
    }
  }

  private async mutateBookMeta(
    bookMeta: {
      played: number;
      views: number;
      likes: number;
      dislikes: number;
      comments: number;
    },
    { meta, action }: { meta: string; action: "Plus" | "Minus" }
  ) {
    try {
      const newBookMeta = {
        played: bookMeta.played ?? 0,
        views: bookMeta.views ?? 0,
        likes: bookMeta.likes ?? 0,
        dislikes: bookMeta.dislikes ?? 0,
        comments: bookMeta.comments ?? 0,
      };
      switch (meta) {
        case "comments":
        case "comment":
          action == "Plus" ? newBookMeta.comments++ : newBookMeta.comments--;
          break;
        case "likes":
          action == "Plus" ? newBookMeta.likes++ : newBookMeta.likes--;
          break;
        case "views":
          action == "Plus" ? newBookMeta.views++ : newBookMeta.views--;
          break;
        case "played":
          action == "Plus" ? newBookMeta.played++ : newBookMeta.played--;
          break;
        default:
          throw await errorHandler.CustomError(
            ErrorEnum[500],
            "Invalid action"
          );
      }
      console.log({ newBookMeta });
      return newBookMeta;
    } catch (error) {
      throw error;
    }
  }

  public async filterBooks({
    search,
    language,
    category,
  }: {
    search?: string;
    language?: string;
    category?: string;
  }) {
    const books: BookType[] = [];
    try {
      if (search) {
        const fetchByBooks = await Repo.searchByKeyword(search);
        books.push(...fetchByBooks);
        const fetchByChapter = await chapterService.searchByKeyword(search);
        books.push(...fetchByChapter);
      }
      if(language){
        const lang = await languageService.getLanguageById(language)
        const fetchByLanguage = await Repo.findByLanguage(String(lang._id));
        books.push(...fetchByLanguage);
      }
      if(category){
        const cate = await categoryService.fetchCategory(category);
        const fetchByCategory = await Repo.findByCategory(cate.title);
        books.push(...fetchByCategory);
      }
      return this.getUniqueBooks(books);
    } catch (error:any) {
      throw error;
    }
  }

  private getUniqueBooks(books: BookType[]): BookType[] {
    const uniqueBooks: BookType[] = [];
    const bookIds: string[] = [];

    for (const book of books) {
      if (!bookIds.includes(String(book?._id))) {
        uniqueBooks.push(book);
        bookIds.push(String(book?._id));
      }
    }

    return uniqueBooks;
  }
}

export default new BookService();
