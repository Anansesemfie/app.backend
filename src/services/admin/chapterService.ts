import AWS_S3 from "../../utils/aws-s3";
import chapterService from "../chapterService";
import { AWS_S3_BUCKET_IMAGES } from "../../utils/env";
import { ChapterResponseType, ChapterType } from "../../dto";
import ErrorHandler, { ErrorEnum } from "../../utils/error";
import sessionService from "../sessionService";
import { UsersTypes } from "../../db/models/utils";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class ChapterService {
  private logInfo = "";
  private s3: AWS_S3;
  constructor(bucketName: string = AWS_S3_BUCKET_IMAGES) {
    this.s3 = new AWS_S3(bucketName);
  }

  public async CreateChapter(
    chapter: {
      title: string;
      bookId: string;
      content: string;
      password: string;
    },
    token: string
  ): Promise<object> {
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);
    const newChapter: ChapterType = {
      title: chapter.title,
      book: chapter.bookId,
      file: chapter.content,
      password: chapter.password,
      description: "",
      mimetype: chapter.content.split(".").pop() as string,
    };
    const createdChapter = await chapterService.createChapter(newChapter);

    return createdChapter;
  }

  public async updateChapter(
    id: string,
    chapter: ChapterResponseType,
    token: string
  ): Promise<object> {
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);
    const newChapter = {
      _id: chapter.id,
      title: chapter.title,
      file: chapter.content ?? "",
      password: chapter.password,
      description: "",
      mimetype: chapter.content?.split(".").pop() as string,
      book: chapter.book.id,
    };

    // _id?: string;
    // title: string;
    // description: string;
    // file: string;
    // mimetype: string;
    // password: string;
    // book: string;
    // createdAt?: Date;
    const updated = await chapterService.updateChapter(id, newChapter);
    return updated;
  }

  public async deleteChapter(id: string, token: string): Promise<object> {
    if (!id) {
      throw new CustomError(
        ErrorEnum[403],
        "Id is required",
        ErrorCodes.FORBIDDEN
      );
    }

    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);

    const chapter = await chapterService.fetchChapter(id);
    if (chapter.content?.includes("aws")) {
      const urlParts = chapter.content?.split("/");
      const fileKey = urlParts?.slice(3).join("/");
      await this.s3.deleteObject(fileKey ?? "");
    }

    await chapterService.deleteChapter(chapter.id);

    return {
      message: "Chapter deleted successfully",
    };
  }

  private checkForAdmin(user: any): void {
    if (!user || user?.account !== UsersTypes.admin)
      throw ErrorHandler.CustomError(ErrorEnum[401], "Invalid User");
  }


}

export default new ChapterService();
