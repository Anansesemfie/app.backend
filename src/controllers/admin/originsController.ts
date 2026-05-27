import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";
import originsService from "../../services/admin/originsService";

export const ListOrigins = async (_req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const origins = await originsService.list(token);
    res.status(200).json({ data: origins });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const GetOrigin = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const { id } = req.params;
    const origin = await originsService.getOne(token, id);
    res.status(200).json({ data: origin });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const CreateOrigin = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const origin = await originsService.create(token, req.body);
    res.status(201).json({ data: origin });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const UpdateOrigin = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const { id } = req.params;
    const origin = await originsService.update(token, id, req.body);
    res.status(200).json({ data: origin });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const ToggleOriginActive = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const { id } = req.params;
    const origin = await originsService.toggleActive(token, id);
    res.status(200).json({ data: origin });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
