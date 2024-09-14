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
  public async getAWSURL(file: any, fileType: string): Promise<object> {
    try {
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
      const session = await sessionService.getSession(token);
      if (!session || session?.user?.account !== UsersTypes.admin)
        throw ErrorHandler.CustomError(ErrorEnum[401], "Invalid session ID");
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
}

export default new AudioService();
