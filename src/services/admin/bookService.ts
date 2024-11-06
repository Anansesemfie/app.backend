import HELPERS from "../../utils/helpers";
import AWS_S3 from "../../utils/aws-s3";
import bookService from "../booksService";
import { AWS_S3_BUCKET_IMAGES } from "../../utils/env";
import { BookType } from "../../dto";
import ErrorHandler, { ErrorEnum } from "../../utils/error";
import sessionService from "../sessionService";
import { UsersTypes } from "../../db/models/utils";

class AudioService {
  private logInfo = "";
  private s3: AWS_S3;
  constructor(bucketName: string = AWS_S3_BUCKET_IMAGES) {
    this.s3 = new AWS_S3(bucketName);
  }
  public async getAWSURL(
    file: any,
    fileType: string,
    token: string
  ): Promise<object> {
    try {
      const { user } = await sessionService.getSession(token);
      this.checkForAdmin(user);
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
  public async CreateBook(book: BookType, token: string): Promise<object> {
    try {
      const { user } = await sessionService.getSession(token);
      this.checkForAdmin(user);
      const createdBook = await bookService.createBook(book, token);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } creating book @ ${HELPERS.currentTime()}`;
      return createdBook;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } creating book @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async UpdateBook(book: BookType, token: string): Promise<object> {
    try {
      const { user } = await sessionService.getSession(token);
      this.checkForAdmin(user);
      if (!book?._id)
        throw ErrorHandler.CustomError(ErrorEnum[401], "Book ID is required");
      const updatedBook = await bookService.updateBook(book?._id, book);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } updating book @ ${HELPERS.currentTime()}`;
      return updatedBook;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } updating book @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async AnalyzeBook(bookId: string, token: string): Promise<object> {
    try {
      const { user } = await sessionService.getSession(token);
      this.checkForAdmin(user);
      if (!bookId)
        throw ErrorHandler.CustomError(ErrorEnum[401], "Book ID is required");
      const analyzedBook = await bookService.analyzeBook(bookId);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } analyzing book @ ${HELPERS.currentTime()}`;
      return analyzedBook;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } analyzing book @ ${HELPERS.currentTime()}`;
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

export default new AudioService();
