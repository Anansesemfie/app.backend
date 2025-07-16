import subscriptionsService from "../services/subscriptionsService";
import { CustomErrorHandler } from "../utils/CustomError";
import { Request, Response } from "express";

export const getSubscription = async (req: Request, res: Response) => {
  try {
    const subscriptionId = req.params.subscriptionId;
    const subscription = await subscriptionsService.fetchOne(subscriptionId);
    res.status(200).json({ data: subscription });
  } catch (error: any) {
  
    CustomErrorHandler.handle(error, res);
  }
};

export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await subscriptionsService.fetchAllSubscriptions();
    res.status(200).json({ data: subscriptions });
  } catch (error: any) {
    
    CustomErrorHandler.handle(error, res);
  }
};
