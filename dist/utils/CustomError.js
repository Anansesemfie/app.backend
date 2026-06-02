"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.CustomErrorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Sentry = __importStar(require("@sentry/node"));
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
            Sentry.captureException(error);
            return res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
                status: ErrorCodes.INTERNAL_SERVER_ERROR,
            });
        }
        else {
            Sentry.captureException(error);
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
