import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";
import revenueService from "../../services/admin/revenueService";

export const GetSummary = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const summary = await revenueService.getSummary(token);
    res.status(200).json({ data: summary });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
