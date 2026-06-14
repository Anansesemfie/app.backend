import { CustomErrorHandler } from "../utils/CustomError";
import genreService from "../services/genreService";
import { Request, Response } from "express";

export const getGenres = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const { genres, total, page: currentPage, limit: currentLimit } = await genreService.fetchAllGenres({ page, limit, search });
    res.status(200).json({ data: genres, total, page: currentPage, limit: currentLimit });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await genreService.fetchGenre(id);
    res.status(200).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};
