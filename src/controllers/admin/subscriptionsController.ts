import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";
import subscriptionsService from "../../services/admin/subscriptionsService";

export const GetStats = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const stats = await subscriptionsService.getStats(token);
    res.status(200).json({ data: stats });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const ListSubscriptions = async (_req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const subscriptions = await subscriptionsService.list(token);
    res.status(200).json({ data: subscriptions });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const CreateSubscription = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const subscription = await subscriptionsService.create(token, req.body);
    res.status(201).json({ data: subscription });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const UpdateSubscription = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const { id } = req.params;
    const subscription = await subscriptionsService.update(token, id, req.body);
    res.status(200).json({ data: subscription });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const DeleteSubscription = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const { id } = req.params;
    const subscription = await subscriptionsService.delete(token, id);
    res.status(200).json({ data: subscription });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
