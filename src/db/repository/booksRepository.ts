import { Book } from "../models";
import { BookType, BookUpdateType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import { BookStatus } from "../models/utils";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import HELPERS from "../../utils/helpers";

class BookRepository {
  public async create(book: BookType): Promise<BookType> {
    try {
      return await Book.create(book);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error creating book",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async fetchOne(bookId: string): Promise<BookType> {
    try {
      const fetchedBook = await Book.findOne({
        _id: bookId,
      });
      return fetchedBook;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching book",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async update(bookId: string, book: BookUpdateType): Promise<BookType> {
    try {
      const updatedBook = await Book.findOneAndUpdate({ _id: bookId }, book, {
        new: true,
      });
      return updatedBook;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error updating book",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async delete(bookId:string) {
    try{
      HELPERS.LOG('delete',{bookId})
      await Book.findByIdAndDelete(bookId)

    }
    catch(error){
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Error deleting book",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async fetchAll(
    numberOfRecords: number = 5,
    page: number = 0,
    params: any = { status: BookStatus.Active }
  ): Promise<BookType[]> {
    try {
      const sanitizedParams = this.sanitizeRegex(params);
      const fetchedBooks = await Book.find({ ...sanitizedParams })
        .skip(numberOfRecords * (page - 1))
        .limit(numberOfRecords)
        .sort({ createdAt: -1 });
      return fetchedBooks;
    } catch (error) {
      HELPERS.LOG("Error fetching books:", { error });
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching books",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  private sanitizeRegex(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeRegex(item));
    } else if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        if (key === "$regex" && typeof obj[key] !== "string") {
          // Skip invalid $regex
          continue;
        }
        sanitized[key] = this.sanitizeRegex(obj[key]);
      }
      // Remove keys that became empty objects
      for (const key in sanitized) {
        if (
          sanitized[key] &&
          typeof sanitized[key] === "object" &&
          !Array.isArray(sanitized[key]) &&
          Object.keys(sanitized[key]).length === 0
        ) {
          delete sanitized[key];
        }
      }
      return sanitized;
    }
    return obj;
  }
}
export default new BookRepository();
