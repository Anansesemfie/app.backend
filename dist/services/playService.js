"use strict";
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
class PlayService {
    constructor() {
        this.logInfo = "";
    }
    unAuthorizedUserPlay(chapterId_1) {
        return __awaiter(this, arguments, void 0, function* (chapterId, userId = "") {
            var _a, _b, _c, _d;
            try {
                const chapter = yield chapterService_1.default.fetchChapter(chapterId);
                if (((_a = chapter === null || chapter === void 0 ? void 0 : chapter.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "sample")
                    return chapter;
                const book = yield booksService_1.default.fetchBook((_c = (_b = chapter === null || chapter === void 0 ? void 0 : chapter.book) === null || _b === void 0 ? void 0 : _b._id) !== null && _c !== void 0 ? _c : "");
                const chapters = yield chapterService_1.default.fetchChapters(book === null || book === void 0 ? void 0 : book._id);
                const chapterToReturn = (_d = chapters.find((chapter) => { var _a; return ((_a = chapter.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "sample"; })) !== null && _d !== void 0 ? _d : chapters[0];
                this.logInfo = `${helpers_1.default.loggerInfo.success} unauthorized user played chapter: ${chapterToReturn === null || chapterToReturn === void 0 ? void 0 : chapterToReturn.id} @ ${helpers_1.default.currentTime()}`;
                return {
                    chapter: chapterToReturn,
                    playTime: (chapterToReturn === null || chapterToReturn === void 0 ? void 0 : chapterToReturn.title.toLowerCase()) === "sample" ? 1 : 0.25,
                    status: userId ? "No Active subscription" : "Not logged in",
                };
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching books @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    authorizedUserPlay(chapterId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { user } = yield sessionService_1.default.getSession(sessionId);
                if (!user.subscription)
                    return yield this.unAuthorizedUserPlay(chapterId, user._id);
                const subscription = yield subscribersService_1.default.validateSubscription(user.subscription);
                if (!subscription) {
                    return yield this.unAuthorizedUserPlay(chapterId, user._id);
                }
                const chapter = yield chapterService_1.default.fetchChapter(chapterId);
                yield seenService_1.default.updateSeen(((_a = chapter === null || chapter === void 0 ? void 0 : chapter.book) === null || _a === void 0 ? void 0 : _a._id) || "", user._id, {
                    playedAt: helpers_1.default.currentTime(),
                    subscription: user === null || user === void 0 ? void 0 : user.subscription,
                });
                this.logInfo = `${helpers_1.default.loggerInfo.success} authorized user played chapter: ${chapter === null || chapter === void 0 ? void 0 : chapter.id}`;
                return {
                    chapter,
                    playTime: 1,
                };
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching books @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
}
exports.default = new PlayService();
