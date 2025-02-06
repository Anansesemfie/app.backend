import Repo from "../db/repository/booksRepository";
import seenService from "./seenService";
import sessionService from "./sessionService";
import subscribersService from "./subscribersService";

import { BookType, BookUpdateType } from "../dto";
import HELPERS from "../utils/helpers";
import errorHandler, { ErrorEnum } from "../utils/error";
import { BookStatus, UsersTypes } from "../db/models/utils";

class BookService {
  private logInfo = "";
  public async createBook(book: BookType, session: string): Promise<BookType> {
    try {
      const { user } = await sessionService.getSession(session);
      if (!user) {
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Invalid session ID"
        );
      }
      if (user.account !== UsersTypes.admin) {
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Unauthorized access"
        );
      }
      book.uploader = user?._id as string;
      book.folder = await HELPERS.generateFolderName(book.title);
      const valid = await this.validateBookData(book);
      if (!valid) {
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Invalid book data"
        );
      }
      const newBook = await Repo.create(book);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } creating book @ ${HELPERS.currentTime()}`;
      return newBook;
    } catch (error: unknown) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } creating book @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  //write a function that validates book data
  public async fetchBooks({
    page = 1,
    limit = 10,
    token = "",
  }: {
    page: number;
    limit: number;
    params?: {};
    token?: string;
  }): Promise<BookType[]> {
    let books: BookType[] = [];
    try {
      if (token) {
        const booksToFetch = await this.fetchBooksInSubscription(token);

        if (!booksToFetch.length) {
          console.log({ booksToFetch });
          books = await Repo.fetchAll(limit, page);
        } else {
          books = await Repo.fetchAll(limit, page, {
            _id: { $in: booksToFetch },
          });
        }
      } else {
        books = await Repo.fetchAll(limit, page);
      }
      //
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
  ): Promise<BookType> {
    try {
      if (!bookId) {
        throw await errorHandler.CustomError(ErrorEnum[403], "Invalid book ID");
      }
      if (sessionId) {
        const booksToFetch = await this.fetchBooksInSubscription(sessionId);
        if (booksToFetch.length && !booksToFetch.includes(bookId)) {
          throw await errorHandler.CustomError(
            ErrorEnum[403],
            "Unauthorized access"
          );
        }
      }
      const book = await Repo.fetchOne(bookId);

      if (sessionId) {
        const { user } = await sessionService.getSession(sessionId);
        await seenService.createNewSeen(
          book?._id as string,
          user._id as string
        );
      }
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching book @ ${HELPERS.currentTime()}`;
      return book;
    } catch (error: unknown) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching book @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
    }
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

  async fetchBooksInSubscription(token: string): Promise<string[]> {
    try {
      const { user } = await sessionService.getSession(token);
      if (!user.subscription) {
        return [];
      }
      const subscription = await subscribersService.fetchOne({
        _id: user.subscription,
      });
      if (!subscription) {
        return [];
      }
      return subscription.books as string[];
    } catch (error: any) {
      return [];
    } finally {
    }
  }

  public async analyzeBook(bookId: string): Promise<{
    played: number;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  }> {
    try {
      const book = await this.fetchBook(bookId);
      return book.meta;
    } catch (error: any) {
      throw error;
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

      return newBookMeta;
    } catch (error) {
      throw error;
    }
  }

  public async filterBooks({
    page = 1,
    limit = 10,
    search,
    language,
    category,
  }: {
    page: number;
    limit: number;
    search?: string;
    language?: string;
    category?: string;
  }) {
    const books: BookType[] = [];
    try {
      const params: {
        status: BookStatus;
        title?: {};
        category?: {};
        languages?: {};
      } = { status: BookStatus.Active };
      if (search) {
        params["title"] = { $regex: search };
      }
      if (language) {
        params["languages"] = { $in: [language] };
      }
      if (category) {
        params["category"] = { $in: [category] };
      }
      const fetchByBooks = await Repo.fetchAll(limit, page, params);
      books.push(...fetchByBooks);
      return this.getUniqueBooks(books);
    } catch (error: any) {
      console.log({ error });
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
  private async validateBookData(book: BookType) {
    switch (true) {
      case !book.title:
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Title is required"
        );
      case !book.category.length:
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Category is required"
        );
      case !book.languages.length:
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Language is required"
        );
      // case !book.folder:
      //   throw await errorHandler.CustomError(ErrorEnum[400], "Folder is required");
      case !book.cover:
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Cover is required"
        );
      case !book.uploader:
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Uploader is required"
        );
      default:
        return true;
    }
  }
}

export default new BookService();
