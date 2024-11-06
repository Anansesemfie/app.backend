import booksService from "../services/booksService";
import errorHandler from "../utils/error";
import { Request, Response } from "express";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const page = req.query.page as string;
    const limit = req.query.limit as string;
    const token = res.locals.sessionId;
    const books = await booksService.fetchBooks({
      page: parseInt(page),
      limit: parseInt(limit),
      token,
    });
    res
      .status(200)
      .json({ data: { page: page, records: limit, results: books } });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const sessionId = res.locals.sessionId;
    const book = await booksService.fetchBook(bookId, sessionId);
    res.status(200).json({ data: book });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const filterBooks = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const language = req.query.language as string;
    const category = req.query.category as string;
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const books = await booksService.filterBooks({
      page,
      limit,
      search,
      language,
      category,
    });
    res.status(200).json({ data: books });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};
