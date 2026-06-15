import { Request, Response } from "express";
import authorService from "../services/authorService";
import { CustomErrorHandler } from "../utils/CustomError";

export const getAuthors = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1000;
    const search = req.query.search as string;
    const { authors, total, page: currentPage, limit: currentLimit } = await authorService.fetchAllAuthors({ page, limit, search });
    res.status(200).json({ data: authors, total, page: currentPage, limit: currentLimit });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await authorService.fetchAuthor(id);
    res.status(200).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};
