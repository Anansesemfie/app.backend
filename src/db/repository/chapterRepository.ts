import { Chapter } from "../models";
import { ChapterType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class ChapterRepository {
  public async createChapter(chapter: ChapterType): Promise<ChapterType> {
    try {
      const newChapter = new Chapter(chapter);
      await newChapter.save();
      return newChapter;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error creating chapter",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
  public async getChapters(bookId: string): Promise<ChapterType[]> {
    try {
      const chapters = await Chapter.find({ book: bookId });
      return chapters;
    } catch (error: any) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching chapters",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async getChapterById(chapterId: string): Promise<ChapterType> {
    try {
      const chapter = await Chapter.findOne({ _id: chapterId });
      return chapter;
    } catch (error: any) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching chapter",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
  public async getChapterByTitle(
    chapterTitle: string = "sample"
  ): Promise<ChapterType> {
    try {
      const chapter = await Chapter.findOne({ title: chapterTitle });
      return chapter;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching chapter",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async updateChapter(id: string, chapter: ChapterType) {
    try {
      const updatedChapter = await Chapter.findOneAndUpdate(
        { _id: id },
        chapter,
        {
          new: true,
        }
      );
      return updatedChapter;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Error updating chapter",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async dropChapter(chapterId: string) {
    try {
      await Chapter.findByIdAndDelete(chapterId);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Error deleting chapter",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async bulkDelete(bookId: string) {
    try {
      await Chapter.deleteMany({ bookId });
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Error deleting bulk chapters",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async searchByKeyword(keyword: string): Promise<ChapterType[]> {
    try {
      const matchedBooks = await Chapter.find({
        title: { $regex: keyword, $options: "i" },
      });
      return matchedBooks;
    } catch (error: any) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error searching books",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
}

export default new ChapterRepository();
