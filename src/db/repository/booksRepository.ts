import { Book } from "../models";
import { BookType, BookUpdateType } from "../../dto";
import errHandler, { ErrorEnum } from "../../utils/error";
import { BookStatus } from "../models/utils";

class BookRepository {
  public async create(book: BookType): Promise<BookType> {
    try {
      return await Book.create(book);
    } catch (error: any) {
      console.log(error);
      throw await errHandler.CustomError(ErrorEnum[400], error._message);
    }
  }

  public async fetchOne(bookId: string): Promise<BookType> {
    try {
      const fetchedBook = await Book.findOne({
        _id: bookId,
      });
      return fetchedBook;
    } catch (error: any) {
      throw await errHandler.CustomError(ErrorEnum[400], "Error fetching book");
    }
  }

  public async update(bookId: string, book: BookUpdateType): Promise<BookType> {
    try {
      const updatedBook = await Book.findOneAndUpdate({ _id: bookId }, book, {
        new: true,
      });
      return updatedBook;
    } catch (error: any) {
      throw await errHandler.CustomError(ErrorEnum[400], "Error updating book");
    }
  }

  public async fetchAll(
    numberOfRecords: number = 5,
    page: number = 0,
    params: {} = { status: BookStatus.Active }
  ): Promise<BookType[]> {
    try {
      const fetchedBooks = await Book.find({ ...params })
        .skip(numberOfRecords * (page - 1))
        .limit(numberOfRecords)
        .sort({ createdAt: -1 });
      return fetchedBooks;
    } catch (error: any) {
      console.log({ error });
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching books"
      );
    }
  }
}
export default new BookRepository();
