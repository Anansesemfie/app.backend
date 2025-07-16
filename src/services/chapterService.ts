import Repo from "../db/repository/chapterRepository";
import booksService from "./booksService";
import { ChapterResponseType, ChapterType } from "../dto";
import { ErrorEnum } from "../utils/error";
import CustomError, { ErrorCodes } from "../utils/CustomError";
class ChapterService {
  private logInfo = "";

  public async createChapter(
    chapter: ChapterType
  ): Promise<ChapterResponseType> {
    const createdChapter = await Repo.createChapter(chapter);
    if (!createdChapter) {
      throw new CustomError(
        "Unknown error",
        "Could not create chapter",
        ErrorCodes.BAD_REQUEST
      );
    }

    return await this.formatChapter(createdChapter);
  }
  public async fetchChapters(
    book: string,
    token: string = ""
  ): Promise<ChapterResponseType[]> {
    if (token) {
      const booksToFetch = await booksService.fetchBooksInSubscription(token);
      if (booksToFetch.length && !booksToFetch.includes(book)) {
        throw new CustomError(
          ErrorEnum[403],
          "Unauthorised access",
          ErrorCodes.FORBIDDEN
        );
      }
    }
    const chapters = await Repo.getChapters(book);

    return Promise.all(chapters.map(this.formatChapter));
  }

  public async fetchChapter(
    chapterId: string,
    substring: string = ""
  ): Promise<ChapterResponseType> {
    const chapter = chapterId
      ? await Repo.getChapterById(chapterId)
      : await Repo.getChapterByTitle(substring);

    return await this.formatChapter(chapter);
  }

  public async updateChapter(chapterId: string, chapter: ChapterType) {
    return await Repo.updateChapter(chapterId, chapter);
  }

  async deleteChapter(chapterId: string) {
    await Repo.dropChapter(chapterId);
  }

  async deleteManyChapters(bookId: string) {
    await Repo.bulkDelete(bookId);
  }
  public async searchByKeyword(keyword: string) {
    const chapters = await Repo.searchByKeyword(keyword);
    const books = await Promise.all(
      chapters.map(async (chapter) => {
        const book = await booksService.fetchBook(String(chapter.book));
        return book;
      })
    );
    return books;
  }
  private async formatChapter(
    chapter: ChapterType
  ): Promise<ChapterResponseType> {
    const Book = await booksService.fetchBook(chapter.book);
    return {
      id: chapter._id ?? "",
      title: chapter.title,
      content: chapter.file,
      description: chapter.description,
      password: chapter.password,
      book: Book,
      createdAt: chapter.createdAt ?? "",
    };
  }
}
export default new ChapterService();
