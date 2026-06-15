import { Request, Response } from "express";
import narratorService from "../../services/narratorService";
import { CustomErrorHandler } from "../../utils/CustomError";

export const createNarrator = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const sessionID = res.locals.sessionId;
    const result = await narratorService.createNarrator(data, sessionID);
    res.status(201).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const updateNarrator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const sessionID = res.locals.sessionId;
    const result = await narratorService.updateNarrator(id, data, sessionID);
    res.status(200).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const deleteNarrator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sessionID = res.locals.sessionId;
    await narratorService.deleteNarrator(id, sessionID);
    res.status(204).send();
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getAllNarrators = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1000;
    const search = req.query.search as string;
    const sort = { createdAt: -1 };
    const { narrators, total, page: currentPage, limit: currentLimit } = await narratorService.fetchAllNarrators({ page, limit, search, sort });
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
