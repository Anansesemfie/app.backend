import { Request, Response } from "express";
import genreService from "../../services/genreService";
import { CustomErrorHandler } from "../../utils/CustomError";

export const createGenre = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const sessionID = res.locals.sessionId;
    const result = await genreService.createGenre(data, sessionID);
    res.status(201).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const sessionID = res.locals.sessionId;
    const result = await genreService.updateGenre(id, data, sessionID);
    res.status(200).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sessionID = res.locals.sessionId;
    await genreService.deleteGenre(id, sessionID);
    res.status(204).send();
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getAllGenres = async (req: Request, res: Response) => {
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

export const toggleGenreActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sessionID = res.locals.sessionId;
    const result = await genreService.toggleGenreActive(id, sessionID);
    res.status(200).json({ data: result });
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
