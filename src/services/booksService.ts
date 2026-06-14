import Repo from "../db/repository/booksRepository";
import seenService from "./seenService";
import sessionService from "./sessionService";
import subscribersService from "./subscribersService";
import subscriptionsService from "./subscriptionsService";
import chapterService from "./chapterService";
import ReactionService from "./reactionService";
import { CacheService } from "./utils/cacheService";

import {
  BookResponseType,
  BookType,
  BookUpdateType,
  AuthorResponseType,
  NarratorResponseType,
} from "../dto";
import HELPERS from "../utils/helpers";
import { ErrorEnum } from "../utils/error";
import { BookStatus, UsersTypes } from "../db/models/utils";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { sanitizeHtml } from "../utils/richText";

class BookService {
  private logInfo = "";
  public async createBook(
    book: BookType,
    session: string,
  ): Promise<BookResponseType> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to create a book",
        ErrorCodes.FORBIDDEN,
      );
    }
    book.uploader = user?._id as string;
    book.folder = await HELPERS.generateFolderName(book.title);
    book.description = sanitizeHtml(book.description);
    const valid = await this.validateBookData(book);
    if (!valid) {
      throw new CustomError(
        ErrorEnum[400],
        "Invalid book data",
        ErrorCodes.BAD_REQUEST,
      );
    }
    const newBook = await Repo.create(book);
    await CacheService.clearPattern("books:*");
    return this.formatBookData(newBook, true);
  }

  public async deleteBook(id: string) {
    if (!id) {
      throw new CustomError(
        ErrorEnum[401],
        "Unable to delete book",
        ErrorCodes.BAD_REQUEST,
      );
    }
    //delete all chapters
    await chapterService.deleteManyChapters(id);
    await Repo.delete(id);
    await CacheService.clearPattern("books:*");
  }

  //write a function that validates book data
  public async fetchBooks({
    page = 1,
    limit = 10,
    token = "",
    params = {},
    isAdmin = false,
  }: {
    page: number;
    limit: number;
    params?: {};
    token?: string;
    isAdmin?: boolean;
  }): Promise<{ books: BookResponseType[]; page: number; limit: number }> {
    const cacheKey = `books:list:p:${page}:l:${limit}:t:${token}:admin:${isAdmin}:params:${JSON.stringify(params)}`;
    const cached = await CacheService.get<{ books: BookResponseType[]; page: number; limit: number }>(cacheKey);
    if (cached) return cached;

    let books: BookType[] = [];

    if (token) {
      const booksToFetch = (await this.fetchBooksInSubscription(token)) || [];
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
      books.map((book) => this.formatBookData(book, isAdmin)),
    );

    const result = { books: formattedBooks, page, limit };
    await CacheService.set(cacheKey, result, 1800); // 30 mins
    return result;
  }

  public async fetchBook(
    bookId: string,
    sessionId: string = "",
    isAdmin: boolean = false,
  ): Promise<BookResponseType> {
    if (!bookId) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book ID",
        ErrorCodes.BAD_REQUEST,
      );
    }
    
    const cacheKey = `books:one:id:${bookId}:s:${sessionId}:admin:${isAdmin}`;
    const cached = await CacheService.get<BookResponseType>(cacheKey);
    if (cached) {
      if (sessionId) {
        const { user } = await sessionService.getSession(sessionId);
        await seenService.createNewSeen(bookId, user._id as string);
      }
      return cached;
    }

    if (sessionId) {
      const { user } = await sessionService.getSession(sessionId);
      const booksToFetch = (await this.fetchBooksInSubscription(sessionId)) || [];
      if (booksToFetch.length && !booksToFetch.includes(bookId)) {
        throw new CustomError(
          ErrorEnum[403],
          "Unauthorized access",
          ErrorCodes.FORBIDDEN,
        );
      }

      await seenService.createNewSeen(bookId, user._id as string);
    }
    const book = await Repo.fetchOne(bookId);
    if (!book) {
      throw new CustomError(
        ErrorEnum[404],
        "Book not found",
        ErrorCodes.NOT_FOUND,
      );
    }
    const formattedBook = await this.formatBookData(book, isAdmin);
    await CacheService.set(cacheKey, formattedBook, 1800);
    return formattedBook;
  }
  public async updateBook(
    bookID: string,
    book: BookUpdateType,
    isAdmin: boolean = false,
  ): Promise<BookResponseType> {
    if (!bookID) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book ID",
        ErrorCodes.BAD_REQUEST,
      );
    }

    if (book.description) book.description = sanitizeHtml(book.description);
    const updatedBook = await Repo.update(bookID, book);
    await CacheService.clearPattern("books:*");
    return this.formatBookData(updatedBook, isAdmin);
  }

  public async updateBookMeta(
    bookId: string,
    metaAction: { meta: string; action: "Plus" | "Minus" },
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
      metaAction,
    );
    if (!newMeta) {
      throw new CustomError(
        ErrorEnum[400],
        "Invalid meta action",
        ErrorCodes.BAD_REQUEST,
      );
    }
    book.meta = newMeta;

    await this.updateBook(bookId, book, false);
    // updateBook calls clearPattern("books:*")
  }

  async fetchBooksInSubscription(token: string): Promise<string[]> {
    const { user } = await sessionService.getSession(token);
    if (!user || !user.subscription) {
      return [];
    }
    const subscription = await subscribersService.fetchOne({
      _id: user.subscription,
    });
    if (!subscription || !subscription.parent) {
      return [];
    }
    const parentSubscription = await subscriptionsService.fetchOne(
      subscription.parent,
    );
    return (parentSubscription?.books as string[]) || [];
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
    { meta, action }: { meta: string; action: "Plus" | "Minus" },
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
        dislikes: "dislikes",
        views: "views",
        played: "played",
      };

      const key = metaMap[meta];
      if (!key) {
        throw new CustomError(
          ErrorEnum[500],
          "Invalid action",
          ErrorCodes.INTERNAL_SERVER_ERROR,
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
        ErrorCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async filterBooks({
    page = 1,
    limit = 10,
    search,
    language,
    category,
    genre,
    author,
    narrator,
    token = "",
    isAdmin = false,
  }: {
    page: number;
    limit: number;
    search?: string;
    language?: string | string[];
    category?: string | string[];
    genre?: string | string[];
    author?: string | string[];
    narrator?: string | string[];
    token?: string;
    isAdmin?: boolean;
  }): Promise<BookResponseType[]> {
    const cacheKey = `books:filter:s:${search}:l:${language}:c:${category}:g:${genre}:a:${author}:n:${narrator}:p:${page}:limit:${limit}:t:${token}:admin:${isAdmin}`;
    const cached = await CacheService.get<BookResponseType[]>(cacheKey);
    if (cached) return cached;

    const books: BookResponseType[] = [];
    try {
      const params: {
        status: BookStatus;
        title?: {};
        category?: {};
        genres?: {};
        languages?: {};
        authors?: {};
        narrators?: {};
      } = { status: BookStatus.Active };

      const normalize = (val: string | string[] | undefined): string[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        return String(val)
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      };

      if (search) {
        params["title"] = { $regex: search, $options: "i" };
      }

      const languages = normalize(language);
      if (languages.length > 0) {
        params["languages"] = { $in: languages };
      }

      const categories = normalize(category);
      if (categories.length > 0) {
        params["category"] = { $in: categories };
      }

      const genres = normalize(genre);
      if (genres.length > 0) {
        params["genres"] = { $in: genres };
      }

      const authors = normalize(author);
      if (authors.length > 0) {
        params["authors"] = { $in: authors };
      }

      const narrators = normalize(narrator);
      if (narrators.length > 0) {
        params["narrators"] = { $in: narrators };
      }

      const fetchByBooks = await Repo.fetchAll(limit, page, params);
      const uniqueBooks = this.getUniqueBooks(fetchByBooks);

      const formatBooks = await Promise.all(
        uniqueBooks.map((book) => this.formatBookData(book, isAdmin)),
      );
      books.push(...formatBooks);
      await CacheService.set(cacheKey, books, 1800);
      return books;
    } catch (error: any) {
      throw error;
    }
  }

  public async getLikedBooksByUser(
    sessionId: string,
    isAdmin: boolean = false,
  ): Promise<BookResponseType[]> {
    const cacheKey = `books:liked:s:${sessionId}:admin:${isAdmin}`;
    const cached = await CacheService.get<BookResponseType[]>(cacheKey);
    if (cached) return cached;

    const { user } = await sessionService.getSession(sessionId);
    const userId = user._id as string;
    const likedBookIds = await ReactionService.getUserReaction(userId);
    const likedBooks: BookResponseType[] = [];
    for (const bookId of likedBookIds) {
      const book = await Repo.fetchOne(bookId);
      if (book) {
        likedBooks.push(await this.formatBookData(book, isAdmin));
      }
    }
    await CacheService.set(cacheKey, likedBooks, 1800);
    return likedBooks;
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
        throw new CustomError(
          ErrorEnum[400],
          "Title is required",
          ErrorCodes.BAD_REQUEST,
        );
      case !book.category.length:
        throw new CustomError(
          ErrorEnum[400],
          "Category is required",
          ErrorCodes.BAD_REQUEST,
        );
      case !book.languages.length:
        throw new CustomError(
          ErrorEnum[400],
          "Language is required",
          ErrorCodes.BAD_REQUEST,
        );
      case !book.authors.length:
        throw new CustomError(
          ErrorEnum[400],
          "Author is required",
          ErrorCodes.BAD_REQUEST,
        );
      // case !book.folder:
      //   throw await errorHandler.CustomError(ErrorEnum[400], "Folder is required");
      case !book.cover:
        throw new CustomError(
          ErrorEnum[400],
          "Cover is required",
          ErrorCodes.BAD_REQUEST,
        );
      case !book.uploader:
        throw new CustomError(
          ErrorEnum[400],
          "Uploader is required",
          ErrorCodes.BAD_REQUEST,
        );
      default:
        return true;
    }
  }

  private async formatBookData(
    book: any,
    isAdmin: boolean = false,
  ): Promise<BookResponseType> {
    const toAuthorResponse = (a: any): AuthorResponseType => {
      if (typeof a === "object" && a !== null) {
        return {
          id: a._id?.toString() || "",
          name: a.name || "",
          bio: a.bio,
          active: a.active ?? true,
        };
      }
      return {
        id: a?.toString() || "",
        name: a?.toString() || "",
        bio: undefined,
        active: true,
      };
    };

    const toNarratorResponse = (n: any): NarratorResponseType => {
      if (typeof n === "object" && n !== null) {
        return {
          id: n._id?.toString() || "",
          name: n.name || "",
          bio: n.bio,
          active: n.active ?? true,
        };
      }
      return {
        id: n?.toString() || "",
        name: n?.toString() || "",
        bio: undefined,
        active: true,
      };
    };

    const formatMetadata = (m: any) => {
      if (!m) return "";
      const isObject = typeof m === "object" && m !== null;
      if (isAdmin) {
        return isObject ? m._id?.toString() || m.toString() : m.toString();
      }
      return isObject
        ? m.title || m.name || m._id?.toString() || m.toString()
        : m.toString();
    };

    const formattedBook: BookResponseType = {
      id: book._id?.toString() || "",
      title: book.title.trim(),
      description: book.description?.trim() || "",
      snippet: book.snippet,
      category: book.category?.map(formatMetadata) || [],
      genres: book.genres?.map(formatMetadata) || [],
      authors: (book.authors || []).map(toAuthorResponse),
      narrators: (book.narrators || []).map(toNarratorResponse),
      languages: book.languages?.map(formatMetadata) || [],
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
