import booksService from "../services/booksService";
import { Request, Response } from "express";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await booksService.getBooks();
    res.status(200).json(books);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await booksService.getBook(req.params.bookId);
    res.status(200).json(book);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
