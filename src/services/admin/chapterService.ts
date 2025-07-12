import HELPERS from "../../utils/helpers";
import AWS_S3 from "../../utils/aws-s3";
import chapterService from "../chapterService";
import { AWS_S3_BUCKET_IMAGES } from "../../utils/env";
import { ChapterType } from "../../dto";
import ErrorHandler, { ErrorEnum } from "../../utils/error";
import sessionService from "../sessionService";
import { UsersTypes } from "../../db/models/utils";
import Repo from "../../db/repository/chapterRepository";

class ChapterService {
  private logInfo = "";
  private s3: AWS_S3;
  constructor(bucketName: string = AWS_S3_BUCKET_IMAGES) {
    this.s3 = new AWS_S3(bucketName);
  }

  public async CreateChapter(
    chapter: { title: string; bookId: string; content: string },
    token: string
  ): Promise<object> {
    try {
      const { user } = await sessionService.getSession(token);
      this.checkForAdmin(user);
      const newChapter: ChapterType = {
        title: chapter.title,
        book: chapter.bookId,
        file: chapter.content,
        description: "",
        mimetype: "",
      };
      const createdChapter = await chapterService.createChapter(newChapter);
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

  public async updateChapter(
    chapter: ChapterType,
    token: string
  ): Promise<object> {
    try {
      const { user } = await sessionService.getSession(token);
      this.checkForAdmin(user);
      //   const updatedChapter = await chapterService.updateChapter(chapter);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } updating chapter @ ${HELPERS.currentTime()}`;
      //   return updatedChapter;
      return {};
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } updating chapter @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async deleteChapter(chapterURL: string): Promise<object> {
  try {
    if (!chapterURL)
      throw ErrorHandler.CustomError(ErrorEnum[400], "Chapter URL is required");

    const urlParts = chapterURL.split('/');
    const fileKey = urlParts.slice(3).join('/');

    await this.s3.deleteObject(fileKey);

     const chapter = await Repo.getChapterByFile(chapterURL); 
    if (!chapter?._id) {
      throw ErrorHandler.CustomError(ErrorEnum[404], "Chapter not found");
    }

    await Repo.deleteChapter(chapter._id);

    this.logInfo = `${HELPERS.loggerInfo.success} deleting chapter @ ${HELPERS.currentTime()}`;

    return {
      message: "Chapter deleted successfully",
      fileKey,
    };
  } catch (error: any) {
    this.logInfo = `${HELPERS.loggerInfo.error} deleting chapter @ ${HELPERS.currentTime()}`;
    throw error;
  } finally {
    await HELPERS.logger(this.logInfo);
    this.logInfo = "";
  }
}

  private checkForAdmin(user: any): void {
    if (!user || user?.account !== UsersTypes.admin)
      throw ErrorHandler.CustomError(ErrorEnum[401], "Invalid User");
  }


}

export default new ChapterService();
