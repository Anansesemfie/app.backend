import { Request, Response, NextFunction } from "express";
import { ErrorEnum } from "../../utils/error";
import HELPER from "../../utils/helpers";
import CustomError, { CustomErrorHandler, ErrorCodes } from "../../utils/CustomError";

export async function CHECKAPPTOKEN(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      res.locals.sessionId = null;
      return next();
    }
    const tokenParts = authorizationHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid Authorization header format",
        ErrorCodes.FORBIDDEN
      );
    }

    let bearerToken: string | undefined = tokenParts[1];
    bearerToken = await HELPER.DECODE_TOKEN(bearerToken);
    res.locals.sessionId = bearerToken;

    next();
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
}

export async function REQUIREAUTH(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      throw new CustomError(
        ErrorEnum[401],
        "Authentication required",
        ErrorCodes.UNAUTHORIZED
      );
    }
    const tokenParts = authorizationHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid Authorization header format",
        ErrorCodes.FORBIDDEN
      );
    }

    let bearerToken: string | undefined = tokenParts[1];
    bearerToken = await HELPER.DECODE_TOKEN(bearerToken);
    res.locals.sessionId = bearerToken;

    next();
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
}
