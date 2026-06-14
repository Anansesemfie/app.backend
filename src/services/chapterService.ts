import Repo from "../db/repository/chapterRepository";
import booksService from "./booksService";
import { ChapterResponseType, ChapterType } from "../dto";
import { ErrorEnum } from "../utils/error";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { CacheService } from "./utils/cacheService";

class ChapterService {
  private logInfo = "";

  public async createChapter(
    chapter: ChapterType,
    isAdmin: boolean = false
  ): Promise<ChapterResponseType> {
    const createdChapter = await Repo.createChapter(chapter);
    if (!createdChapter) {
      throw new CustomError(
        "Unknown error",
        "Could not create chapter",
        ErrorCodes.BAD_REQUEST
      );
    }

    await CacheService.clearPattern("chapters:*");
    return await this.formatChapter(createdChapter, isAdmin);
  }
  public async fetchChapters(
    book: string,
    token: string = "",
    isAdmin: boolean = false
  ): Promise<ChapterResponseType[]> {
    const cacheKey = `chapters:list:b:${book}:t:${token}:admin:${isAdmin}`;
    const cached = await CacheService.get<ChapterResponseType[]>(cacheKey);
    if (cached) return cached;

    if (token) {
      const booksToFetch = (await booksService.fetchBooksInSubscription(token)) || [];
      if (booksToFetch.length && !booksToFetch.includes(book)) {
        throw new CustomError(
          ErrorEnum[403],
          "Unauthorised access",
          ErrorCodes.FORBIDDEN
        );
      }
    }
    const chapters = await Repo.getChapters(book);

    const result = await Promise.all(
      chapters.map((chapter) => this.formatChapter(chapter, isAdmin))
    );
    await CacheService.set(cacheKey, result, 1800);
    return result;
  }

  public async fetchChapter(
    chapterId: string,
    substring: string = "",
    isAdmin: boolean = false
  ): Promise<ChapterResponseType> {
    const cacheKey = `chapters:one:id:${chapterId}:sub:${substring}:admin:${isAdmin}`;
    const cached = await CacheService.get<ChapterResponseType>(cacheKey);
    if (cached) return cached;

    const chapter = chapterId
      ? await Repo.getChapterById(chapterId)
      : await Repo.getChapterByTitle(substring);

    if (!chapter) {
      throw new CustomError(
        ErrorEnum[404],
        "Chapter not found",
        ErrorCodes.NOT_FOUND
      );
    }

    const result = await this.formatChapter(chapter, isAdmin);
    await CacheService.set(cacheKey, result, 1800);
    return result;
  }

  public async updateChapter(
    chapterId: string,
    chapter: ChapterType,
    isAdmin: boolean = false
  ) {
    const updated = await Repo.updateChapter(chapterId, chapter);
    if (!updated) return null;
    await CacheService.clearPattern("chapters:*");
    return await this.formatChapter(updated, isAdmin);
  }

  async deleteChapter(chapterId: string) {
    await Repo.dropChapter(chapterId);
    await CacheService.clearPattern("chapters:*");
  }

  async deleteManyChapters(bookId: string) {
    await Repo.bulkDelete(bookId);
    await CacheService.clearPattern("chapters:*");
  }
  public async searchByKeyword(keyword: string, isAdmin: boolean = false) {
    const chapters = await Repo.searchByKeyword(keyword);
    const books = await Promise.all(
      chapters.map(async (chapter) => {
        const book = await booksService.fetchBook(String(chapter.book), "", isAdmin);
        return book;
      })
    );
    return books;
  }
  private async formatChapter(
    chapter: ChapterType,
    isAdmin: boolean = false
  ): Promise<ChapterResponseType> {
    const Book = await booksService.fetchBook(chapter.book, "", isAdmin);
    const type = chapter.mimetype == "pdf" ? "ebook" : "audio";
    return {
      id: chapter._id ?? "",
      title: chapter.title,
      content: chapter.file,
      description: chapter.description,
      password: chapter.password,
      order: chapter.order ?? 0,
      book: Book,
      createdAt: chapter.createdAt ?? "",
      type,
    };
  }
}
export default new ChapterService();
