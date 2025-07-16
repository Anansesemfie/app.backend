import booksService from "../services/booksService";
import { Request, Response } from "express";

import{ CustomErrorHandler } from "../utils/CustomError";
import HELPERS from "../utils/helpers";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const token = res.locals.sessionId ?? '';
    HELPERS.LOG({token})
    const {books,page:index,limit:pageSize} = await booksService.fetchBooks({
      page,
      limit,
      params: { title: { $regex: search } },
      token,
    });
    res
      .status(200)
      .json({ data: { page: index, records: pageSize, results: books } });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const sessionId = res.locals.sessionId;
    const book = await booksService.fetchBook(bookId, sessionId);
    res.status(200).json({ data: book });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
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
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
