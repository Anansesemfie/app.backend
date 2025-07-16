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
const chapterService_1 = __importDefault(require("./chapterService"));
const booksService_1 = __importDefault(require("./booksService"));
const seenService_1 = __importDefault(require("./seenService"));
const sessionService_1 = __importDefault(require("./sessionService"));
const subscribersService_1 = __importDefault(require("./subscribersService"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const CustomError_1 = __importStar(require("../utils/CustomError"));
const error_1 = require("../utils/error");
class PlayService {
    constructor() {
        this.logInfo = "";
    }
    play(chapterId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!chapterId) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Chapter required are required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            if (!sessionId) {
                return yield this.unAuthorizedUserPlay(chapterId);
            }
            return yield this.authorizedUserPlay(chapterId, sessionId);
        });
    }
    unAuthorizedUserPlay(chapterId_1) {
        return __awaiter(this, arguments, void 0, function* (chapterId, userId = "") {
            var _a, _b, _c, _d;
            const chapter = yield chapterService_1.default.fetchChapter(chapterId);
            if (((_a = chapter === null || chapter === void 0 ? void 0 : chapter.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "sample")
                return chapter;
            const book = yield booksService_1.default.fetchBook((_c = (_b = chapter === null || chapter === void 0 ? void 0 : chapter.book) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "");
            const chapters = yield chapterService_1.default.fetchChapters(book === null || book === void 0 ? void 0 : book.id);
            const chapterToReturn = (_d = chapters.find((chapter) => { var _a; return ((_a = chapter.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "sample"; })) !== null && _d !== void 0 ? _d : chapters[0];
            return {
                chapter: chapterToReturn,
                playTime: (chapterToReturn === null || chapterToReturn === void 0 ? void 0 : chapterToReturn.title.toLowerCase()) === "sample" ? 1 : 0.25,
                status: userId ? "No Active subscription" : "Not logged in",
            };
        });
    }
    authorizedUserPlay(chapterId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { user } = yield sessionService_1.default.getSession(sessionId);
            if (!user.subscription) {
                return yield this.unAuthorizedUserPlay(chapterId, user._id); // If user has no subscription, return unauthorized play
            }
            const subscription = yield subscribersService_1.default.validateSubscription(user.subscription);
            if (!subscription) {
                return yield this.unAuthorizedUserPlay(chapterId, user._id); // If subscription is invalid, return unauthorized play
            }
            const chapter = yield chapterService_1.default.fetchChapter(chapterId);
            yield seenService_1.default.recordPlay(((_a = chapter === null || chapter === void 0 ? void 0 : chapter.book) === null || _a === void 0 ? void 0 : _a.id) || "", user._id, helpers_1.default.currentTime(), user === null || user === void 0 ? void 0 : user.subscription);
            return {
                chapter,
                playTime: 1,
            };
        });
    }
}
exports.default = new PlayService();
