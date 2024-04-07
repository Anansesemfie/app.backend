import playService from "../services/playService";
import { Request, Response } from "express";

export const Play = async (req: Request, res: Response) => {
  try {
    const chapterId = req.params.chapter;
    const userId = res.locals.userId;
    const chapter = userId
      ? await playService.authorizedUserPlay(chapterId, userId)
      : await playService.unAuthorizedUserPlay(chapterId, userId);
    res.status(200).json(chapter);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
