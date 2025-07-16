import HELPERS from "../../utils/helpers";
import AWS_S3 from "../../utils/aws-s3";
import bookService from "../booksService";
import { AWS_S3_BUCKET_IMAGES } from "../../utils/env";
import { BookType, BookUpdateType } from "../../dto";
import ErrorHandler, { ErrorEnum } from "../../utils/error";
import sessionService from "../sessionService";
import { UsersTypes } from "../../db/models/utils";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
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
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);

    const signedUrl = await this.s3.getSignedUrl(file, fileType);

    return signedUrl;
  }
  public async CreateBook(book: BookType, token: string): Promise<object> {
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);
    const createdBook = await bookService.createBook(book, token);
    return createdBook;
  }

  public async UpdateBook(
    id: string,
    book: BookUpdateType,
    token: string
  ): Promise<object> {
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);
    if (!id) {
      throw new CustomError(
        ErrorEnum[401],
        "Book ID is required",
        ErrorCodes.BAD_REQUEST
      );
    }
    const updatedBook = await bookService.updateBook(id, book);

    return updatedBook;
  }

  public async DeleteBook(id: string, token: string) {
    if (!id) {
      throw new CustomError(
        ErrorEnum[401],
        "Book ID is required",
        ErrorCodes.BAD_REQUEST
      );
    }
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);

    await bookService.deleteBook(id);

    return "book deleted";
  }

  public async AnalyzeBook(bookId: string, token: string): Promise<object> {
    if (!bookId) {
      throw new CustomError(
        ErrorEnum[401],
        "Book ID is required",
        ErrorCodes.BAD_REQUEST
      );
    }
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);

    const analyzedBook = await bookService.analyzeBook(bookId);
    return analyzedBook;
  }
  private checkForAdmin(user: any): void {
    if (!user || user?.account !== UsersTypes.admin)
      throw new CustomError(
        ErrorEnum[401],
        "Invalid User",
        ErrorCodes.UNAUTHORIZED
      );
  }
}

export default new AudioService();
