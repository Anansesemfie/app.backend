import { Book } from "../models";
import { BookType, BookUpdateType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import { BookStatus } from "../models/utils";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import HELPERS from "../../utils/helpers";

class BookRepository {
  public async create(book: BookType): Promise<BookType> {
    try {
      // Strip top-level empty-string values to avoid ObjectId cast errors
      // (e.g. when the client sends organization: "" instead of omitting the field)
      const cleanBook = Object.fromEntries(
        Object.entries(book).filter(([k, v]) => v !== "" && !k.startsWith("$") && k !== "_id")
      );
      return await Book.create(cleanBook);
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
      })
        .populate("authors")
        .populate("narrators")
        .populate("category")
        .populate("genres")
        .populate("languages")
        .populate("organization")
        .populate("associates");
      return fetchedBook;
    } catch (error) {
      // console.error("Error in fetchOne:", error);
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching book",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async update(bookId: string, book: BookUpdateType): Promise<BookType> {
    try {
      // If 'book' is a Mongoose document, convert to a plain object first
      const bookData = (book as any).toObject ? (book as any).toObject() : book;

      // Strip top-level empty-string values to avoid ObjectId cast errors
      // (e.g. when the client sends organization: "" instead of omitting the field)
      // Also remove _id and internal Mongoose fields to avoid update errors
      const cleanBook = Object.fromEntries(
        Object.entries(bookData).filter(([k, v]) => v !== "" && !k.startsWith("$") && k !== "_id")
      ) as BookUpdateType;

      const updatedBook = await Book.findOneAndUpdate(
        { _id: bookId },
        { $set: cleanBook },
        { new: true }
      )
        .populate("authors")
        .populate("narrators")
        .populate("category")
        .populate("genres")
        .populate("languages")
        .populate("organization")
        .populate("associates");
      return updatedBook;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error updating book",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  public async delete(bookId: string) {
    try {
      await Book.findByIdAndDelete(bookId);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Error deleting book",
        ErrorCodes.INTERNAL_SERVER_ERROR
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
        .sort({ createdAt: -1 })
        .populate("authors")
        .populate("narrators")
        .populate("category")
        .populate("genres")
        .populate("languages")
        .populate("organization")
        .populate("associates");
      return fetchedBooks;
    } catch (error) {
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
      // Only recurse into plain objects. Preserve ObjectId, Date, etc.
      if (obj.constructor && obj.constructor.name !== "Object") {
        return obj;
      }

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
