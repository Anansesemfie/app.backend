import { Chapter } from "../models";
import { chapterDTO } from "../../dto";
import errHandler, { ErrorEnum } from "../../utils/error";

class ChapterRepository {
  public async getChapters(bookId: string): Promise<chapterDTO[]> {
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

  public async getChapterById(chapterId: string): Promise<chapterDTO> {
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
  ): Promise<chapterDTO> {
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
}

export default new ChapterRepository();
