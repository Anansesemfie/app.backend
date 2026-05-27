import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";
import dashboardService from "../../services/admin/dashboardService";

export const GetStats = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const stats = await dashboardService.getStats(token);
    res.status(200).json({ data: stats });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const GetPulse = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const days = parseInt((req.query.days as string) ?? "14", 10) || 14;
    const pulse = await dashboardService.getPulse(token, days);
    res.status(200).json({ data: pulse });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
