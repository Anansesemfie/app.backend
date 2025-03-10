import reactionService from "../services/reactionService";
import errorHandler from "../utils/error";
import { Request, Response } from "express";

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
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
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
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};
