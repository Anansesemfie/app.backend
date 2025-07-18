import { Request, Response, NextFunction } from "express";
import errorHandler, { ErrorEnum } from "../../utils/error";
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
    // Extract the token from the Authorization header
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

   CustomErrorHandler.handle(error,res)
  }
}
