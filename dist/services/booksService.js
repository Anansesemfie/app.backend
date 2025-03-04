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
const booksRepository_1 = __importDefault(require("../db/repository/booksRepository"));
const seenService_1 = __importDefault(require("./seenService"));
const sessionService_1 = __importDefault(require("./sessionService"));
const subscribersService_1 = __importDefault(require("./subscribersService"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const error_1 = __importStar(require("../utils/error"));
const utils_1 = require("../db/models/utils");
class BookService {
    constructor() {
        this.logInfo = "";
    }
    createBook(book, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield sessionService_1.default.getSession(session);
                if (!user) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid session ID");
                }
                if (user.account !== utils_1.UsersTypes.admin) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Unauthorized access");
                }
                book.uploader = user === null || user === void 0 ? void 0 : user._id;
                book.folder = yield helpers_1.default.generateFolderName(book.title);
                const valid = yield this.validateBookData(book);
                if (!valid) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Invalid book data");
                }
                const newBook = yield booksRepository_1.default.create(book);
                this.logInfo = `${helpers_1.default.loggerInfo.success} creating book @ ${helpers_1.default.currentTime()}`;
                return newBook;
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
    //write a function that validates book data
    fetchBooks(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, token = "", }) {
            let books = [];
            try {
                if (token) {
                    const booksToFetch = yield this.fetchBooksInSubscription(token);
                    if (!booksToFetch.length) {
                        books = yield booksRepository_1.default.fetchAll(limit, page);
                    }
                    else {
                        books = yield booksRepository_1.default.fetchAll(limit, page, {
                            _id: { $in: booksToFetch },
                        });
                    }
                }
                else {
                    books = yield booksRepository_1.default.fetchAll(limit, page);
                }
                //
                this.logInfo = `${helpers_1.default.loggerInfo.success} fetching books @ ${helpers_1.default.currentTime()}`;
                return books;
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
    fetchBook(bookId_1) {
        return __awaiter(this, arguments, void 0, function* (bookId, sessionId = "") {
            try {
                if (!bookId) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid book ID");
                }
                if (sessionId) {
                    const booksToFetch = yield this.fetchBooksInSubscription(sessionId);
                    console.log('books fetched');
                    if (booksToFetch.length && !booksToFetch.includes(bookId)) {
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Unauthorized access");
                    }
                }
                const book = yield booksRepository_1.default.fetchOne(bookId);
                console.log("book fetched");
                if (sessionId) {
                    const { user } = yield sessionService_1.default.getSession(sessionId);
                    console.log("creating session");
                    yield seenService_1.default.createNewSeen(book === null || book === void 0 ? void 0 : book._id, user._id);
                }
                this.logInfo = `${helpers_1.default.loggerInfo.success} fetching book @ ${helpers_1.default.currentTime()}`;
                return book;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching book @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
            }
        });
    }
    updateBook(bookID, book) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!bookID) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid book ID");
                }
                const updatedBook = yield booksRepository_1.default.update(bookID, book);
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
    updateBookMeta(bookId, metaAction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield this.fetchBook(bookId);
                const newMeta = yield this.mutateBookMeta(book === null || book === void 0 ? void 0 : book.meta, metaAction);
                book.meta = newMeta;
                yield this.updateBook(bookId, book);
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[500], "Invalid action");
            }
        });
    }
    fetchBooksInSubscription(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield sessionService_1.default.getSession(token);
                if (!user.subscription) {
                    return [];
                }
                const subscription = yield subscribersService_1.default.fetchOne({
                    _id: user.subscription,
                });
                if (!subscription) {
                    return [];
                }
                return subscription.books;
            }
            catch (error) {
                return [];
            }
            finally {
            }
        });
    }
    analyzeBook(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield this.fetchBook(bookId);
                return book.meta;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mutateBookMeta(bookMeta_1, _a) {
        return __awaiter(this, arguments, void 0, function* (bookMeta, { meta, action }) {
            var _b, _c, _d, _e, _f;
            try {
                const newBookMeta = {
                    played: (_b = bookMeta.played) !== null && _b !== void 0 ? _b : 0,
                    views: (_c = bookMeta.views) !== null && _c !== void 0 ? _c : 0,
                    likes: (_d = bookMeta.likes) !== null && _d !== void 0 ? _d : 0,
                    dislikes: (_e = bookMeta.dislikes) !== null && _e !== void 0 ? _e : 0,
                    comments: (_f = bookMeta.comments) !== null && _f !== void 0 ? _f : 0,
                };
                switch (meta) {
                    case "comments":
                    case "comment":
                        action == "Plus" ? newBookMeta.comments++ : newBookMeta.comments--;
                        break;
                    case "likes":
                        action == "Plus" ? newBookMeta.likes++ : newBookMeta.likes--;
                        break;
                    case "views":
                        action == "Plus" ? newBookMeta.views++ : newBookMeta.views--;
                        break;
                    case "played":
                        action == "Plus" ? newBookMeta.played++ : newBookMeta.played--;
                        break;
                    default:
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[500], "Invalid action");
                }
                return newBookMeta;
            }
            catch (error) {
                throw error;
            }
        });
    }
    filterBooks(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, search, language, category, }) {
            const books = [];
            try {
                const params = { status: utils_1.BookStatus.Active };
                if (search) {
                    params["title"] = { $regex: search };
                }
                if (language) {
                    params["languages"] = { $in: [language] };
                }
                if (category) {
                    params["category"] = { $in: [category] };
                }
                const fetchByBooks = yield booksRepository_1.default.fetchAll(limit, page, params);
                books.push(...fetchByBooks);
                return this.getUniqueBooks(books);
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    getUniqueBooks(books) {
        const uniqueBooks = [];
        const bookIds = [];
        for (const book of books) {
            if (!bookIds.includes(String(book === null || book === void 0 ? void 0 : book._id))) {
                uniqueBooks.push(book);
                bookIds.push(String(book === null || book === void 0 ? void 0 : book._id));
            }
        }
        return uniqueBooks;
    }
    validateBookData(book) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (true) {
                case !book.title:
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Title is required");
                case !book.category.length:
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Category is required");
                case !book.languages.length:
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Language is required");
                // case !book.folder:
                //   throw await errorHandler.CustomError(ErrorEnum[400], "Folder is required");
                case !book.cover:
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Cover is required");
                case !book.uploader:
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Uploader is required");
                default:
                    return true;
            }
        });
    }
}
exports.default = new BookService();
