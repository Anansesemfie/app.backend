import { CustomErrorHandler } from "../utils/CustomError";
import playService from "../services/playService";
import { Request, Response } from "express";

export const Play = async (req: Request, res: Response) => {
  try {
    const chapterId = req.params.chapter;
    const userId = res.locals.sessionId;
    let chapter = null;
    if (userId) {
      chapter = await playService.authorizedUserPlay(chapterId, userId);
    } else {
      chapter = await playService.unAuthorizedUserPlay(chapterId, userId);
    }

    res.status(200).json({ data: chapter });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
