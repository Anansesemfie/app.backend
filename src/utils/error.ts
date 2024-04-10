// import fs from 'fs';

export enum ErrorEnum {
  "Unknown error" = 400,
  "UniqueConstraint" = 401,
  "NotFound" = 404,
  "ForbiddenError" = 403,
  "TimedOutError" = 408,
}

class ErrorHandler {
  private static readonly STATUS_ERROR_404: number = 404;
  private static readonly STATUS_ERROR_500: number = 500;
  private static readonly STATUS_ERROR_403: number = 403;
  private static readonly STATUS_ERROR_401: number = 401;
  private static readonly STATUS_ERROR_400: number = 400;
  private static readonly STATUS_ERROR_408: number = 408;

  public fileName?: string;

  constructor(file?: string) {
    this.fileName = file;
  }
  public async CustomError(
    error: string,
    errorMessage: string
  ): Promise<{ code: string; message: string }> {
    try {
      return { code: error, message: errorMessage };
    } catch (error) {
      throw new Error("Unknown");
    }
  }

  public async HandleError(
    error: string,
    message = ""
  ): Promise<{ code: number; message: string; exMessage: string }> {
    console.log("message", error);
    switch (error) {
      case ErrorEnum[408]:
        return {
          code: ErrorHandler.STATUS_ERROR_408,
          message: "Time Out",
          exMessage: message || "Request Timed Out",
        };
      case ErrorEnum[404]:
        //code:404
        return {
          code: ErrorHandler.STATUS_ERROR_404,
          message: "Not Found",
          exMessage: message || "Data not found",
        };

      case ErrorEnum[403]:
        //code:403
        return {
          code: ErrorHandler.STATUS_ERROR_403,
          message: "Forbidden Action",
          exMessage:
            message ||
            "Action is not allowed or there is something you are missing",
        };

      case ErrorEnum[401]:
        //code:401
        return {
          code: ErrorHandler.STATUS_ERROR_401,
          message: "Unauthorized action",
          exMessage: message || "Field name should be unique",
        };

      case ErrorEnum[400]:
        //code:400
        return {
          code: ErrorHandler.STATUS_ERROR_400,
          message: "Bad Request",
          exMessage: message || "Contact Support for clarification",
        };

      default:
        //code:500
        return {
          code: ErrorHandler.STATUS_ERROR_500,
          message: "Internal Server Error",
          exMessage: message || "Sorry, this is on us. Please try again!",
        };
    }
  }
}

export default new ErrorHandler();
