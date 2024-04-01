import { Chapter } from "../models";
import { chapterDTO } from "../../dto";

class ChapterRepository {
  public async getChapters(bookId: string): Promise<chapterDTO[]> {
    try {
      const chapters = await Chapter.find({ book: bookId });
      return chapters;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getChapter(chapterId: string): Promise<chapterDTO> {
    try {
      const chapter = await Chapter.findOne({ _id: chapterId });
      return chapter;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new ChapterRepository();
