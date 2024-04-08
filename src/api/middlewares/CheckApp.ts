import { Request, Response, NextFunction } from "express";
import ErrorHandler, { ErrorEnum } from "../../utils/error";
import HELPER from "../../utils/helpers";

const errorHandler = new ErrorHandler();

export async function CHECKAPPTOKEN(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      return (res.locals.hasToken = false);
    }
    res.locals.hasToken = true;
    // Extract the token from the Authorization header
    const tokenParts = authorizationHeader.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
      throw await errorHandler.CustomError(
        ErrorEnum[403],
        "Invalid Authorization header format"
      );

    let bearerToken: string | undefined = tokenParts[1];
    bearerToken = await HELPER.DECODE_TOKEN(bearerToken);
    res.locals.sessionId = bearerToken;

    next();
  } catch (error: any) {
    let errors = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res
      .status(errors.code)
      .json({ error: errors.message, message: errors.exMessage });
  }
}
