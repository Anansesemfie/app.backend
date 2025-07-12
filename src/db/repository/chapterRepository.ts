import { Chapter } from "../models";
import { ChapterType } from "../../dto";
import errHandler, { ErrorEnum } from "../../utils/error";

class ChapterRepository {
  public async createChapter(chapter: ChapterType): Promise<ChapterType> {
    try {
      const newChapter = new Chapter(chapter);
      await newChapter.save();
      return newChapter;
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        error?.message ?? "Error creating chapter"
      );
    }
  }
  public async getChapters(bookId: string): Promise<ChapterType[]> {
    try {
      const chapters = await Chapter.find({ book: bookId });
      return chapters;
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching chapters"
      );
    }
  }

  public async getChapterById(chapterId: string): Promise<ChapterType> {
    try {
      const chapter = await Chapter.findOne({ _id: chapterId });
      return chapter;
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching chapter"
      );
    }
  }
  public async getChapterByTitle(
    chapterTitle: string = "sample"
  ): Promise<ChapterType> {
    try {
      const chapter = await Chapter.findOne({ title: chapterTitle });
      return chapter;
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching chapter"
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
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error searching books"
      );
    }
  }

  public async getChapterByFile(fileKey: string) {
    return await Chapter.findOne({ file: fileKey });
  }

 public async deleteChapter(id: string) {
  return await Chapter.findByIdAndDelete(id);
}

}

export default new ChapterRepository();
