import reactionService from "../services/reactionService";
import { Request, Response } from "express";
import { CustomErrorHandler } from "../utils/CustomError";

export const likeBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const sessionId = res.locals.sessionId;
    const reaction = await reactionService.createReaction({
      sessionID: sessionId,
      bookID: bookId,
      action: "Liked",
    });
    res.status(200).json({ data: reaction });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const dislikeBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const sessionId = res.locals.sessionId;
    const reaction = await reactionService.createReaction({
      sessionID: sessionId,
      bookID: bookId,
      action: "Disliked",
    });
    res.status(200).json({ data: reaction });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};
