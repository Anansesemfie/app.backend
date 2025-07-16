import CustomError, { CustomErrorHandler } from "../utils/CustomError";
import chapterService from "../services/chapterService";
import { Request, Response } from "express";

export const getChapters = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const token = res.locals.sessionId;
    const chapters = await chapterService.fetchChapters(bookId, token);
    res.status(200).json({ data: chapters });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getChapter = async (req: Request, res: Response) => {
  try {
    const chapter = await chapterService.fetchChapter(req.params.chapterId);
    res.status(200).json({ data: chapter });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};
