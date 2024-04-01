import { Book } from "../models";
import { bookDTO } from "../../dto";
class BookRepository {
  public async create(book: bookDTO): Promise<bookDTO> {
    try {
      return await Book.create(book);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async fetchOne(bookId: string): Promise<bookDTO> {
    try {
      const fetchedBook = await Book.findOne({
        _id: bookId,
      });
      return fetchedBook;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async update(book: bookDTO, bookId: string): Promise<bookDTO> {
    try {
      const updatedBook = await Book.findOneAndUpdate({ _id: bookId }, book, {
        new: true,
      });
      return updatedBook;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async fetchAll(): Promise<bookDTO[]> {
    try {
      const fetchedBooks = await Book.find({ status: "Active" });
      return fetchedBooks;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new BookRepository();
