import booksService from "../services/booksService";
import errorHandler from "../utils/error";
import { Request, Response } from "express";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await booksService.fetchBooks();
    res.status(200).json(books);
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const sessionId = req.params.sessionId;
    const book = await booksService.fetchBook(bookId, sessionId);
    res.status(200).json(book);
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const filterBooks = async (req:Request,res:Response)=>{
  
try {
  const search = req.query.search as string
  const language = req.query.language as string
  const category = req.query.category as string

  const books = await booksService.filterBooks({search,language,category})
  res.status(200).json(books)
} catch (error:any) {
  const { code, message, exMessage } = await errorHandler.HandleError(
    error?.errorCode,
    error?.message
  );
  res.status(code).json({ error: message, message: exMessage });
}
}
