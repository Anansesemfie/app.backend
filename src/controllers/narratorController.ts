import { Request, Response } from "express";
import narratorService from "../services/narratorService";
import { CustomErrorHandler } from "../utils/CustomError";

export const getNarrators = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const { narrators, total, page: currentPage, limit: currentLimit } = await narratorService.fetchAllNarrators({ page, limit, search });
    res.status(200).json({ data: narrators, total, page: currentPage, limit: currentLimit });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getNarrator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await narratorService.fetchNarrator(id);
    res.status(200).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};
