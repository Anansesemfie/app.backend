import subscriptionsService from "../services/subscriptionsService";
import errorHandler from "../utils/error";
import { Request, Response } from "express";

export const getSubscription = async (req: Request, res: Response) => {
  try {
    const subscriptionId = req.params.subscriptionId;
    const subscription = await subscriptionsService.fetchOne(subscriptionId);
    res.status(200).json({ data: subscription });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await subscriptionsService.fetchAllSubscriptions();
    res.status(200).json({ data: subscriptions });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};
