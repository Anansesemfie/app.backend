import { Request, Response } from "express";
import authorService from "../../services/authorService";
import { CustomErrorHandler } from "../../utils/CustomError";

export const createAuthor = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const sessionID = res.locals.sessionId;
    const result = await authorService.createAuthor(data, sessionID);
    res.status(201).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const sessionID = res.locals.sessionId;
    const result = await authorService.updateAuthor(id, data, sessionID);
    res.status(200).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sessionID = res.locals.sessionId;
    await authorService.deleteAuthor(id, sessionID);
    res.status(204).send();
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
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
