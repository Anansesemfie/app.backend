import booksService from "../services/booksService";
import { Request, Response } from "express";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await booksService.fetchBooks();
    res.status(200).json(books);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await booksService.fetchBook(req.params.bookId);
    res.status(200).json(book);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
