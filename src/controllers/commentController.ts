import { CustomErrorHandler } from "../utils/CustomError";
import commentService from "../services/commentService";
import reportService from "../services/reportService";
import { Request, Response } from "express";

export const postComment = async (req: Request, res: Response) => {
  try {
    const { bookId, comment } = req.body;
    const sessionID = res.locals.sessionId;
    const newComment = await commentService.createComment({
      comment,
      sessionID,
      bookID: bookId,
    });
    res.status(201).json({ data: newComment });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const comments = await commentService.getComments(bookId, { page, limit });
    res.status(200).json({ data: comments });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const postReply = async (req: Request, res: Response) => {
  try {
    const parentId = req.params.commentId;
    const { bookId, comment } = req.body;
    const sessionID = res.locals.sessionId;
    const newReply = await commentService.createComment({
      comment,
      sessionID,
      bookID: bookId,
      parentId,
    });
    res.status(201).json({ data: newReply });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const sessionID = res.locals.sessionId;
    await commentService.deleteComment(commentId, sessionID);
    res.status(200).json({ data: { message: "Comment deleted successfully" } });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};

export const reportComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const { reason } = req.body;
    const sessionID = res.locals.sessionId;
    await reportService.reportComment({
      commentID: commentId,
      sessionID,
      reason,
    });
    res.status(200).json({ data: { message: "Comment reported successfully" } });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};
