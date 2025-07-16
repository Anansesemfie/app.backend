import CustomError, { CustomErrorHandler } from "../utils/CustomError";
import language from "../services/languageService";
import { Request, Response } from "express";

export const createLanguage = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const sessionID = res.locals.sessionId;
    const result = await language.createLanguage(data, sessionID);

    res.status(201).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await language.getAllLanguages();

    res.status(200).json({ data: result });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};
