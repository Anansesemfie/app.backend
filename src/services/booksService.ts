import Repo from "../db/repository/booksRepository";
import seenService from "./seenService";
import sessionService from "./sessionService";
import subscribersService from "./subscribersService";
import chapterService from "./chapterService";

import { BookResponseType, BookType, BookUpdateType } from "../dto";
import HELPERS from "../utils/helpers";
import { ErrorEnum } from "../utils/error";
import { BookStatus, UsersTypes } from "../db/models/utils";
import CustomError, { ErrorCodes } from "../utils/CustomError";

class BookService {
  private logInfo = "";
  public async createBook(
    book: BookType,
    session: string
  ): Promise<BookResponseType> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to create a book",
        ErrorCodes.FORBIDDEN
      );
    }
    book.uploader = user?._id as string;
    book.folder = await HELPERS.generateFolderName(book.title);
    const valid = await this.validateBookData(book);
    if (!valid) {
      throw new CustomError(
        ErrorEnum[400],
        "Invalid book data",
        ErrorCodes.BAD_REQUEST
      );
    }
    const newBook = await Repo.create(book);
    return this.formatBookData(newBook);
  }

  public async deleteBook(id: string) {
    if (!id) {
      throw new CustomError(
        ErrorEnum[401],
        "Unable to delete book",
        ErrorCodes.BAD_REQUEST
      );
    }
    //delete all chapters
    await chapterService.deleteManyChapters(id);
    await Repo.delete(id);
  }

  //write a function that validates book data
  public async fetchBooks({
    page = 1,
    limit = 10,
    token = "",
    params = {},
  }: {
    page: number;
    limit: number;
    params?: {};
    token?: string;
  }): Promise<{ books: BookResponseType[]; page: number; limit: number }> {
    let books: BookType[] = [];
    HELPERS.LOG({ page, limit, token, params });
    if (token) {
      const booksToFetch = await this.fetchBooksInSubscription(token);
      if (!booksToFetch.length) {
        books = await Repo.fetchAll(limit, page, params);
      } else {
        books = await Repo.fetchAll(limit, page, {
          _id: { $in: booksToFetch },
          ...params,
        });
      }
    } else {
      books = await Repo.fetchAll(limit, page, params);
    }
    const formattedBooks = await Promise.all(
      books.map((book) => this.formatBookData(book))
    );

    return { books: formattedBooks, page, limit };
  }

  public async fetchBook(
    bookId: string,
    sessionId: string = ""
  ): Promise<BookResponseType> {
    if (!bookId) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book ID",
        ErrorCodes.BAD_REQUEST
      );
    }
    if (sessionId) {
      const booksToFetch = await this.fetchBooksInSubscription(sessionId);
      if (booksToFetch.length && !booksToFetch.includes(bookId)) {
        throw new CustomError(
          ErrorEnum[403],
          "Unauthorized access",
          ErrorCodes.FORBIDDEN
        );
      }
    }
    const book = await Repo.fetchOne(bookId);
    if (sessionId) {
      const { user } = await sessionService.getSession(sessionId);
      await seenService.createNewSeen(book?._id as string, user._id as string);
    }
    if (!book) {
      throw new CustomError(
        ErrorEnum[404],
        "Book not found",
        ErrorCodes.NOT_FOUND
      );
    }
    return this.formatBookData(book);
  }
  public async updateBook(
    bookID: string,
    book: BookUpdateType
  ): Promise<BookResponseType> {
    if (!bookID) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book ID",
        ErrorCodes.BAD_REQUEST
      );
    }
    const updatedBook = await Repo.update(bookID, book);
    return this.formatBookData(updatedBook);
  }

  public async updateBookMeta(
    bookId: string,
    metaAction: { meta: string; action: "Plus" | "Minus" }
  ) {
    const book = await Repo.fetchOne(bookId);
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
    if (!newMeta) {
      throw new CustomError(
        ErrorEnum[400],
        "Invalid meta action",
        ErrorCodes.BAD_REQUEST
      );
    }
    book.meta = newMeta;

    await this.updateBook(bookId, book);
  }

  async fetchBooksInSubscription(token: string): Promise<string[]> {
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
  }

  public async analyzeBook(bookId: string): Promise<{
    played: number;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  }> {
    const book = await this.fetchBook(bookId);
    return book.meta;
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
      const metaMap: Record<string, keyof typeof newBookMeta> = {
        comments: "comments",
        comment: "comments",
        likes: "likes",
        views: "views",
        played: "played",
      };

      const key = metaMap[meta];
      if (!key) {
        throw await new CustomError(
          ErrorEnum[500],
          "Invalid action",
          ErrorCodes.INTERNAL_SERVER_ERROR
        );
      }

      if (action === "Plus") {
        newBookMeta[key]++;
      } else {
        newBookMeta[key]--;
      }

      return newBookMeta;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Error mutating book meta",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
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
        throw await new CustomError(
          ErrorEnum[400],
          "Title is required",
          ErrorCodes.BAD_REQUEST
        );
      case !book.category.length:
        throw await new CustomError(
          ErrorEnum[400],
          "Category is required",
          ErrorCodes.BAD_REQUEST
        );
      case !book.languages.length:
        throw await new CustomError(
          ErrorEnum[400],
          "Language is required",
          ErrorCodes.BAD_REQUEST
        );
      // case !book.folder:
      //   throw await errorHandler.CustomError(ErrorEnum[400], "Folder is required");
      case !book.cover:
        throw await new CustomError(
          ErrorEnum[400],
          "Cover is required",
          ErrorCodes.BAD_REQUEST
        );
      case !book.uploader:
        throw await new CustomError(
          ErrorEnum[400],
          "Uploader is required",
          ErrorCodes.BAD_REQUEST
        );
      default:
        return true;
    }
  }

  private async formatBookData(book: BookType): Promise<BookResponseType> {
    const formattedBook: BookResponseType = {
      id: book._id?.toString() || "",
      title: book.title.trim(),
      description: book.description?.trim() || "",
      category: book.category,
      authors: book.authors,
      languages: book.languages,
      cover: book.cover.trim(),
      meta: {
        played: book.meta?.played || 0,
        views: book.meta?.views || 0,
        likes: book.meta?.likes || 0,
        dislikes: book.meta?.dislikes || 0,
        comments: book.meta?.comments || 0,
      },
    };
    return formattedBook;
  }
}

export default new BookService();
