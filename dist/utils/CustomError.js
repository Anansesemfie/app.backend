"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.CustomErrorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ErrorCodes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    TIMEOUT: 408,
};
exports.ErrorCodes = ErrorCodes;
class CustomError extends Error {
    constructor(code, message, status) {
        super(message);
        this.code = code;
        this.status = status;
    }
    static create(code, message, status = ErrorCodes.INTERNAL_SERVER_ERROR) {
        return new CustomError(code, message, status);
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
            status: this.status,
        };
    }
}
class CustomErrorHandler {
    static handle(error, res) {
        // If the error is an instance of CustomError, return its properties
        if (error instanceof CustomError) {
            return res.status(error.status).json({
                code: error.code,
                message: error.message,
                status: error.status,
            });
        }
        else if (error instanceof SyntaxError) {
            return res.status(ErrorCodes.BAD_REQUEST).json({
                code: "BAD_REQUEST",
                message: error.message,
                status: ErrorCodes.BAD_REQUEST,
            });
        }
        else if (error instanceof TypeError) {
            return res.status(ErrorCodes.BAD_REQUEST).json({
                code: "TYPE_ERROR",
                message: error.message,
                status: ErrorCodes.BAD_REQUEST,
            });
        }
        //mongoose validation error
        else if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(ErrorCodes.BAD_REQUEST).json({
                code: "VALIDATION_ERROR",
                message: error.message,
                status: ErrorCodes.BAD_REQUEST,
            });
        }
        else if (error instanceof Error) {
            // If it's a standard Error, return a generic error response
            return res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
                status: ErrorCodes.INTERNAL_SERVER_ERROR,
            });
        }
        else {
            // If it's an unknown type, return a generic error response
            return res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({
                code: "UNKNOWN_ERROR",
                message: "An unknown error occurred",
                status: ErrorCodes.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
exports.CustomErrorHandler = CustomErrorHandler;
exports.default = CustomError;
