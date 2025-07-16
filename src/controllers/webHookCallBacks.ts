import subscribersService from "../services/subscribersService";
import { Request, Response } from "express";
import HELPERS from "../utils/helpers";

import { CustomErrorHandler } from "../utils/CustomError";

export const ActivateSubscription = async (req: Request, res: Response) => {
  try {
    const { trxref, reference } = req.query;
    HELPERS.LOG({ trxref, reference });
    const response = await subscribersService.verifySubscription(
      (reference ?? trxref) as string
    );
    res.status(200).json({ data: response });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
