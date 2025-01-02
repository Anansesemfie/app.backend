"use strict";
// import fs from 'fs';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorEnum = void 0;
var ErrorEnum;
(function (ErrorEnum) {
    ErrorEnum[ErrorEnum["Unknown error"] = 400] = "Unknown error";
    ErrorEnum[ErrorEnum["UniqueConstraint"] = 401] = "UniqueConstraint";
    ErrorEnum[ErrorEnum["NotFound"] = 404] = "NotFound";
    ErrorEnum[ErrorEnum["ForbiddenError"] = 403] = "ForbiddenError";
    ErrorEnum[ErrorEnum["TimedOutError"] = 408] = "TimedOutError";
})(ErrorEnum || (exports.ErrorEnum = ErrorEnum = {}));
class ErrorHandler {
    constructor(file) {
        this.fileName = file;
    }
    CustomError(error, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return { code: error, message: errorMessage };
            }
            catch (error) {
                throw new Error("Unknown");
            }
        });
    }
    HandleError(error_1) {
        return __awaiter(this, arguments, void 0, function* (error, message = "") {
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
                        exMessage: message ||
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
        });
    }
}
ErrorHandler.STATUS_ERROR_404 = 404;
ErrorHandler.STATUS_ERROR_500 = 500;
ErrorHandler.STATUS_ERROR_403 = 403;
ErrorHandler.STATUS_ERROR_401 = 401;
ErrorHandler.STATUS_ERROR_400 = 400;
ErrorHandler.STATUS_ERROR_408 = 408;
exports.default = new ErrorHandler();
