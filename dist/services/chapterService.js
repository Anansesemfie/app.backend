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
const chapterRepository_1 = __importDefault(require("../db/repository/chapterRepository"));
const booksService_1 = __importDefault(require("./booksService"));
const error_1 = require("../utils/error");
const CustomError_1 = __importStar(require("../utils/CustomError"));
class ChapterService {
    constructor() {
        this.logInfo = "";
    }
    createChapter(chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdChapter = yield chapterRepository_1.default.createChapter(chapter);
            if (!createdChapter) {
                throw new CustomError_1.default("Unknown error", "Could not create chapter", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            return yield this.formatChapter(createdChapter);
        });
    }
    fetchChapters(book_1) {
        return __awaiter(this, arguments, void 0, function* (book, token = "") {
            if (token) {
                const booksToFetch = yield booksService_1.default.fetchBooksInSubscription(token);
                if (booksToFetch.length && !booksToFetch.includes(book)) {
                    throw new CustomError_1.default(error_1.ErrorEnum[403], "Unauthorised access", CustomError_1.ErrorCodes.FORBIDDEN);
                }
            }
            const chapters = yield chapterRepository_1.default.getChapters(book);
            return Promise.all(chapters.map(this.formatChapter));
        });
    }
    fetchChapter(chapterId_1) {
        return __awaiter(this, arguments, void 0, function* (chapterId, substring = "") {
            const chapter = chapterId
                ? yield chapterRepository_1.default.getChapterById(chapterId)
                : yield chapterRepository_1.default.getChapterByTitle(substring);
            return yield this.formatChapter(chapter);
        });
    }
    updateChapter(chapterId, chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chapterRepository_1.default.updateChapter(chapterId, chapter);
        });
    }
    deleteChapter(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chapterRepository_1.default.dropChapter(chapterId);
        });
    }
    deleteManyChapters(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chapterRepository_1.default.bulkDelete(bookId);
        });
    }
    searchByKeyword(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapters = yield chapterRepository_1.default.searchByKeyword(keyword);
            const books = yield Promise.all(chapters.map((chapter) => __awaiter(this, void 0, void 0, function* () {
                const book = yield booksService_1.default.fetchBook(String(chapter.book));
                return book;
            })));
            return books;
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
                description: chapter.description,
                password: chapter.password,
                book: Book,
                createdAt: (_b = chapter.createdAt) !== null && _b !== void 0 ? _b : "",
            };
        });
    }
}
exports.default = new ChapterService();
