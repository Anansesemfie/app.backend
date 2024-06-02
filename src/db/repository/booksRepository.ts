import { Book } from "../models";
import { BookType, BookUpdateType } from "../../dto";
import errHandler, { ErrorEnum } from "../../utils/error";
import { BookStatus } from "../models/utils";

class BookRepository {
  public async create(book: BookType): Promise<BookType> {
    try {
      return await Book.create(book);
    } catch (error: any) {
      throw await errHandler.CustomError(ErrorEnum[400], "Error creating book");
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

  public async fetchAll(Status:BookStatus = BookStatus.Active): Promise<BookType[]> {
    try {
      const fetchedBooks = await Book.find({ status:Status  });
      return fetchedBooks;
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching books"
      );
    }
  }

  public async searchByKeyword(keyword: string): Promise<BookType[]> {
    try {
      const matchedBooks = await Book.find({ title: { $regex: keyword } });
      return matchedBooks;
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error searching books"
      );
    }
  }

  public async findByLanguage(language: string): Promise<BookType[]> {
    try {
<<<<<<< Updated upstream
      console.log({ language });
      const matchedBooks = await Book.find({ languages:language  });
=======
      const matchedBooks = await Book.find({ languages: language  });
      console.log(matchedBooks);
>>>>>>> Stashed changes
      return matchedBooks;
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error finding books by language"
      );
    }
  }

  public async findByCategory(categories: string): Promise<BookType[]> {
    try {
      const matchedBooks = await Book.find({ category: { $in: categories } });
      return matchedBooks;
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error finding books by category"
      );
    }
  }
}

export default new BookRepository();
