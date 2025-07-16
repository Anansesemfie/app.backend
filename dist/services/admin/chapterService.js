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
const aws_s3_1 = __importDefault(require("../../utils/aws-s3"));
const chapterService_1 = __importDefault(require("../chapterService"));
const env_1 = require("../../utils/env");
const error_1 = __importStar(require("../../utils/error"));
const sessionService_1 = __importDefault(require("../sessionService"));
const utils_1 = require("../../db/models/utils");
const CustomError_1 = __importStar(require("../../utils/CustomError"));
class ChapterService {
    constructor(bucketName = env_1.AWS_S3_BUCKET_IMAGES) {
        this.logInfo = "";
        this.s3 = new aws_s3_1.default(bucketName);
    }
    CreateChapter(chapter, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            this.checkForAdmin(user);
            const newChapter = {
                title: chapter.title,
                book: chapter.bookId,
                file: chapter.content,
                password: chapter.password,
                description: "",
                mimetype: chapter.content.split(".").pop(),
            };
            const createdChapter = yield chapterService_1.default.createChapter(newChapter);
            return createdChapter;
        });
    }
    updateChapter(id, chapter, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { user } = yield sessionService_1.default.getSession(token);
            this.checkForAdmin(user);
            const newChapter = {
                _id: chapter.id,
                title: chapter.title,
                file: (_a = chapter.content) !== null && _a !== void 0 ? _a : "",
                password: chapter.password,
                description: "",
                mimetype: (_b = chapter.content) === null || _b === void 0 ? void 0 : _b.split(".").pop(),
                book: chapter.book.id,
            };
            // _id?: string;
            // title: string;
            // description: string;
            // file: string;
            // mimetype: string;
            // password: string;
            // book: string;
            // createdAt?: Date;
            const updated = yield chapterService_1.default.updateChapter(id, newChapter);
            return updated;
        });
    }
    deleteChapter(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!id) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Id is required", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const { user } = yield sessionService_1.default.getSession(token);
            this.checkForAdmin(user);
            const chapter = yield chapterService_1.default.fetchChapter(id);
            if ((_a = chapter.content) === null || _a === void 0 ? void 0 : _a.includes("aws")) {
                const urlParts = (_b = chapter.content) === null || _b === void 0 ? void 0 : _b.split("/");
                const fileKey = urlParts === null || urlParts === void 0 ? void 0 : urlParts.slice(3).join("/");
                yield this.s3.deleteObject(fileKey !== null && fileKey !== void 0 ? fileKey : "");
            }
            yield chapterService_1.default.deleteChapter(chapter.id);
            return {
                message: "Chapter deleted successfully",
            };
        });
    }
    checkForAdmin(user) {
        if (!user || (user === null || user === void 0 ? void 0 : user.account) !== utils_1.UsersTypes.admin)
            throw error_1.default.CustomError(error_1.ErrorEnum[401], "Invalid User");
    }
}
exports.default = new ChapterService();
