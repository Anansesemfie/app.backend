import subscribersService from "../services/subscribersService";
import { Request, Response } from "express";
import HELPERS from "../utils/helpers";

import errorHandler from "../utils/error";

export const ActivateSubscription = async (req: Request, res: Response) => {
  try {
    const { trxref, reference } = req.query;
    HELPERS.LOG({ trxref, reference });
    const response = await subscribersService.verifySubscription(
      (reference ?? trxref) as string
    );
    res.status(200).json({ data: response });
  } catch (error: any) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code!,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};
