import HELPERS from "../../utils/helpers";
import AWS_S3 from "../../utils/aws-s3";
import chapterService from "../chapterService";
import { AWS_S3_BUCKET_AUDIO } from "../../utils/env";
import ErrorHandler, { ErrorEnum } from "../../utils/error";
import sessionService from "../sessionService";
import { ChapterType } from "../../dto";
import { UsersTypes } from "../../db/models/utils";

class AudioService {
  private logInfo = "";
  private s3: AWS_S3;
  constructor(bucketName: string = AWS_S3_BUCKET_AUDIO) {
    this.s3 = new AWS_S3(bucketName);
  }
  public async getAWSURL(
    file: any,
    fileType: string,
    sessionToken: string
  ): Promise<object> {
    try {
      const session = await sessionService.getSession(sessionToken);
      if (!session || session?.user?.account !== UsersTypes.admin)
        throw await ErrorHandler.CustomError(
          ErrorEnum[401],
          "Invalid session ID!"
        );
      const signedUrl = await this.s3.getSignedUrl(file, fileType);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } uploading audio @ ${HELPERS.currentTime()}`;
      return signedUrl;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } uploading audio @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async CreateChapter(
    chapter: ChapterType,
    sessionToken: string
  ): Promise<ChapterType> {
    try {
      const session = await sessionService.getSession(sessionToken);
      if (!session || session?.user?.account !== UsersTypes.admin)
        throw ErrorHandler.CustomError(ErrorEnum[401], "Invalid session ID");

      const createdChapter = await chapterService.createChapter(chapter);
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
}

export default new AudioService();
