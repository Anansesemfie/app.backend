import Repo from "../db/repository/chapterRepository";
import booksService from "./booksService";
import { ChapterResponseType, ChapterType } from "../dto";
import HELPERS from "../utils/helpers";

class ChapterService {
  private logInfo = "";

  public async createChapter(chapter: ChapterType): Promise<ChapterType> {
    try {
      const createdChapter = await Repo.createChapter(chapter);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } creating chapter @ ${HELPERS.currentTime()}`;
      return createdChapter;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } creating chapter @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
  public async fetchChapters(book: string): Promise<ChapterResponseType[]> {
    try {
      const chapters = await Repo.getChapters(book);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching chapters for book: ${book} @ ${HELPERS.currentTime()}`;
      return Promise.all(chapters.map(this.formatChapter));
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching chapters for book: ${book} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async fetchChapter(
    chapterId: string,
    substring: string = ""
  ): Promise<ChapterResponseType> {
    try {
      const chapter = chapterId
        ? await Repo.getChapterById(chapterId)
        : await Repo.getChapterByTitle(substring);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching chapter: ${chapterId} @ ${HELPERS.currentTime()}`;
      return await this.formatChapter(chapter);
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching chapter: ${chapterId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async searchByKeyword(keyword: string) {
    try {
      const chapters = await Repo.searchByKeyword(keyword);
      const books = await Promise.all(
        chapters.map(async (chapter) => {
          const book = await booksService.fetchBook(String(chapter.book));
          return book;
        })
      );
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching chapter with keyword: ${keyword} @ ${HELPERS.currentTime()}`;
      return books;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching chapter with keyword: ${keyword} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
  private async formatChapter(
    chapter: ChapterType
  ): Promise<ChapterResponseType> {
    const Book = await booksService.fetchBook(chapter.book);
    return {
      id: chapter._id ?? "",
      title: chapter.title,
      content: chapter.file,
      book: Book,
      createdAt: chapter.createdAt ?? "",
    };
  }
}
export default new ChapterService();
