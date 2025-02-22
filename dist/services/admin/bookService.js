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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const aws_s3_1 = __importDefault(require("../../utils/aws-s3"));
const booksService_1 = __importDefault(require("../booksService"));
const env_1 = require("../../utils/env");
const error_1 = __importStar(require("../../utils/error"));
const sessionService_1 = __importDefault(require("../sessionService"));
const utils_1 = require("../../db/models/utils");
class AudioService {
    constructor(bucketName = env_1.AWS_S3_BUCKET_IMAGES) {
        this.logInfo = "";
        this.s3 = new aws_s3_1.default(bucketName);
    }
    getAWSURL(file, fileType, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield sessionService_1.default.getSession(token);
                this.checkForAdmin(user);
                const signedUrl = yield this.s3.getSignedUrl(file, fileType);
                this.logInfo = `${helpers_1.default.loggerInfo.success} uploading audio @ ${helpers_1.default.currentTime()}`;
                return signedUrl;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} uploading audio @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    CreateBook(book, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield sessionService_1.default.getSession(token);
                this.checkForAdmin(user);
                const createdBook = yield booksService_1.default.createBook(book, token);
                this.logInfo = `${helpers_1.default.loggerInfo.success} creating book @ ${helpers_1.default.currentTime()}`;
                return createdBook;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} creating book @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    UpdateBook(book, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield sessionService_1.default.getSession(token);
                this.checkForAdmin(user);
                if (!(book === null || book === void 0 ? void 0 : book._id))
                    throw error_1.default.CustomError(error_1.ErrorEnum[401], "Book ID is required");
                const updatedBook = yield booksService_1.default.updateBook(book === null || book === void 0 ? void 0 : book._id, book);
                this.logInfo = `${helpers_1.default.loggerInfo.success} updating book @ ${helpers_1.default.currentTime()}`;
                return updatedBook;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} updating book @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    AnalyzeBook(bookId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield sessionService_1.default.getSession(token);
                this.checkForAdmin(user);
                if (!bookId)
                    throw error_1.default.CustomError(error_1.ErrorEnum[401], "Book ID is required");
                const analyzedBook = yield booksService_1.default.analyzeBook(bookId);
                this.logInfo = `${helpers_1.default.loggerInfo.success} analyzing book @ ${helpers_1.default.currentTime()}`;
                return analyzedBook;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} analyzing book @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    checkForAdmin(user) {
        if (!user || (user === null || user === void 0 ? void 0 : user.account) !== utils_1.UsersTypes.admin)
            throw error_1.default.CustomError(error_1.ErrorEnum[401], "Invalid User");
    }
}
exports.default = new AudioService();
