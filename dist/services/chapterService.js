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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const chapterRepository_1 = __importDefault(require("../db/repository/chapterRepository"));
const booksService_1 = __importDefault(require("./booksService"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const error_1 = __importStar(require("../utils/error"));
class ChapterService {
    constructor() {
        this.logInfo = "";
    }
    createChapter(chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdChapter = yield chapterRepository_1.default.createChapter(chapter);
                this.logInfo = `${helpers_1.default.loggerInfo.success} creating chapter @ ${helpers_1.default.currentTime()}`;
                return yield this.formatChapter(createdChapter);
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
    fetchChapters(book_1) {
        return __awaiter(this, arguments, void 0, function* (book, token = "") {
            try {
                if (token) {
                    const booksToFetch = yield booksService_1.default.fetchBooksInSubscription(token);
                    if (booksToFetch && !booksToFetch.includes(book)) {
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Unauthorised access");
                    }
                }
                const chapters = yield chapterRepository_1.default.getChapters(book);
                this.logInfo = `${helpers_1.default.loggerInfo.success} fetching chapters for book: ${book} @ ${helpers_1.default.currentTime()}`;
                return Promise.all(chapters.map(this.formatChapter));
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching chapters for book: ${book} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    fetchChapter(chapterId_1) {
        return __awaiter(this, arguments, void 0, function* (chapterId, substring = "") {
            try {
                const chapter = chapterId
                    ? yield chapterRepository_1.default.getChapterById(chapterId)
                    : yield chapterRepository_1.default.getChapterByTitle(substring);
                this.logInfo = `${helpers_1.default.loggerInfo.success} fetching chapter: ${chapterId} @ ${helpers_1.default.currentTime()}`;
                return yield this.formatChapter(chapter);
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching chapter: ${chapterId} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    searchByKeyword(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chapters = yield chapterRepository_1.default.searchByKeyword(keyword);
                const books = yield Promise.all(chapters.map((chapter) => __awaiter(this, void 0, void 0, function* () {
                    const book = yield booksService_1.default.fetchBook(String(chapter.book));
                    return book;
                })));
                this.logInfo = `${helpers_1.default.loggerInfo.success} fetching chapter with keyword: ${keyword} @ ${helpers_1.default.currentTime()}`;
                return books;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching chapter with keyword: ${keyword} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    formatChapter(chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const Book = yield booksService_1.default.fetchBook(chapter.book);
            return {
                id: (_a = chapter._id) !== null && _a !== void 0 ? _a : "",
                title: chapter.title,
                content: chapter.file,
                book: Book,
                createdAt: (_b = chapter.createdAt) !== null && _b !== void 0 ? _b : "",
            };
        });
    }
}
exports.default = new ChapterService();
