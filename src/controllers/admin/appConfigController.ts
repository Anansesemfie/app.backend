import appConfigService from "../../services/admin/appConfigService";
import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";

export const GetSettings = async (req: Request, res: Response) => {
  try {
    const settings = await appConfigService.get();
    res.status(200).json({ data: settings });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const UpdateSettings = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const settings = await appConfigService.update(data);
    res.status(200).json({ data: settings });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
