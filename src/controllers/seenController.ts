
import seenService from "../services/seenService";
import errorHandler from "../utils/error";
import { Request, Response } from "express";


export const getSeen = async (req: Request, res: Response) => {
    try {
      const bookId = req.params.bookId;
      const seen = await seenService.getBookSeenByBookId(bookId);
    res.status(200).json(seen);
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
}