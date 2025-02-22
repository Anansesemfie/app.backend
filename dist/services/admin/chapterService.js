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
const chapterService_1 = __importDefault(require("../chapterService"));
const env_1 = require("../../utils/env");
const error_1 = __importStar(require("../../utils/error"));
const sessionService_1 = __importDefault(require("../sessionService"));
const utils_1 = require("../../db/models/utils");
class ChapterService {
    constructor(bucketName = env_1.AWS_S3_BUCKET_IMAGES) {
        this.logInfo = "";
        this.s3 = new aws_s3_1.default(bucketName);
    }
    CreateChapter(chapter, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield sessionService_1.default.getSession(token);
                this.checkForAdmin(user);
                const newChapter = {
                    title: chapter.title,
                    book: chapter.bookId,
                    file: chapter.content,
                    description: "",
                    mimetype: "",
                };
                const createdChapter = yield chapterService_1.default.createChapter(newChapter);
                this.logInfo = `${helpers_1.default.loggerInfo.success} creating chapter @ ${helpers_1.default.currentTime()}`;
                return createdChapter;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} creating chapter @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    updateChapter(chapter, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield sessionService_1.default.getSession(token);
                this.checkForAdmin(user);
                //   const updatedChapter = await chapterService.updateChapter(chapter);
                this.logInfo = `${helpers_1.default.loggerInfo.success} updating chapter @ ${helpers_1.default.currentTime()}`;
                //   return updatedChapter;
                return {};
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} updating chapter @ ${helpers_1.default.currentTime()}`;
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
exports.default = new ChapterService();
