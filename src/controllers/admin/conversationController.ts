import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";
import conversationService from "../../services/admin/conversationService";

export const GetComments = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const page = parseInt(req.query.page as string ?? "1", 10) || 1;
    const limit = parseInt(req.query.limit as string ?? "20", 10) || 20;
    const bookId = req.query.bookId as string | undefined;
    const data = await conversationService.getComments(token, { page, limit, bookId });
    res.status(200).json({ data });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const DeleteComment = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const id = req.params.id;
    const result = await conversationService.deleteComment(token, id);
    res.status(200).json({ data: result });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
