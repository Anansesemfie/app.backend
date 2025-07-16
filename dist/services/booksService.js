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
const chapterService_1 = __importDefault(require("./chapterService"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const error_1 = require("../utils/error");
const utils_1 = require("../db/models/utils");
const CustomError_1 = __importStar(require("../utils/CustomError"));
class BookService {
    constructor() {
        this.logInfo = "";
    }
    createBook(book, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(session);
            if (user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "You are not authorized to create a book", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            book.uploader = user === null || user === void 0 ? void 0 : user._id;
            book.folder = yield helpers_1.default.generateFolderName(book.title);
            const valid = yield this.validateBookData(book);
            if (!valid) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Invalid book data", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const newBook = yield booksRepository_1.default.create(book);
            return this.formatBookData(newBook);
        });
    }
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new CustomError_1.default(error_1.ErrorEnum[401], "Unable to delete book", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            //delete all chapters
            yield chapterService_1.default.deleteManyChapters(id);
            yield booksRepository_1.default.delete(id);
        });
    }
    //write a function that validates book data
    fetchBooks(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, token = "", params = {}, }) {
            let books = [];
            helpers_1.default.LOG({ page, limit, token, params });
            if (token) {
                const booksToFetch = yield this.fetchBooksInSubscription(token);
                if (!booksToFetch.length) {
                    books = yield booksRepository_1.default.fetchAll(limit, page, params);
                }
                else {
                    books = yield booksRepository_1.default.fetchAll(limit, page, Object.assign({ _id: { $in: booksToFetch } }, params));
                }
            }
            else {
                books = yield booksRepository_1.default.fetchAll(limit, page, params);
            }
            const formattedBooks = yield Promise.all(books.map((book) => this.formatBookData(book)));
            return { books: formattedBooks, page, limit };
        });
    }
    fetchBook(bookId_1) {
        return __awaiter(this, arguments, void 0, function* (bookId, sessionId = "") {
            if (!bookId) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book ID", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            if (sessionId) {
                const booksToFetch = yield this.fetchBooksInSubscription(sessionId);
                if (booksToFetch.length && !booksToFetch.includes(bookId)) {
                    throw new CustomError_1.default(error_1.ErrorEnum[403], "Unauthorized access", CustomError_1.ErrorCodes.FORBIDDEN);
                }
            }
            const book = yield booksRepository_1.default.fetchOne(bookId);
            if (sessionId) {
                const { user } = yield sessionService_1.default.getSession(sessionId);
                yield seenService_1.default.createNewSeen(book === null || book === void 0 ? void 0 : book._id, user._id);
            }
            if (!book) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Book not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            return this.formatBookData(book);
        });
    }
    updateBook(bookID, book) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookID) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book ID", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const updatedBook = yield booksRepository_1.default.update(bookID, book);
            return this.formatBookData(updatedBook);
        });
    }
    updateBookMeta(bookId, metaAction) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield booksRepository_1.default.fetchOne(bookId);
            const newMeta = yield this.mutateBookMeta(book === null || book === void 0 ? void 0 : book.meta, metaAction);
            if (!newMeta) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Invalid meta action", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            book.meta = newMeta;
            yield this.updateBook(bookId, book);
        });
    }
    fetchBooksInSubscription(token) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    analyzeBook(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield this.fetchBook(bookId);
            return book.meta;
        });
    }
    mutateBookMeta(bookMeta_1, _a) {
        return __awaiter(this, arguments, void 0, function* (bookMeta, { meta, action }) {
            var _b, _c, _d, _e, _f, _g;
            try {
                const newBookMeta = {
                    played: (_b = bookMeta.played) !== null && _b !== void 0 ? _b : 0,
                    views: (_c = bookMeta.views) !== null && _c !== void 0 ? _c : 0,
                    likes: (_d = bookMeta.likes) !== null && _d !== void 0 ? _d : 0,
                    dislikes: (_e = bookMeta.dislikes) !== null && _e !== void 0 ? _e : 0,
                    comments: (_f = bookMeta.comments) !== null && _f !== void 0 ? _f : 0,
                };
                const metaMap = {
                    comments: "comments",
                    comment: "comments",
                    likes: "likes",
                    views: "views",
                    played: "played",
                };
                const key = metaMap[meta];
                if (!key) {
                    throw yield new CustomError_1.default(error_1.ErrorEnum[500], "Invalid action", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
                }
                if (action === "Plus") {
                    newBookMeta[key]++;
                }
                else {
                    newBookMeta[key]--;
                }
                return newBookMeta;
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[500], (_g = error.message) !== null && _g !== void 0 ? _g : "Error mutating book meta", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
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
                    throw yield new CustomError_1.default(error_1.ErrorEnum[400], "Title is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                case !book.category.length:
                    throw yield new CustomError_1.default(error_1.ErrorEnum[400], "Category is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                case !book.languages.length:
                    throw yield new CustomError_1.default(error_1.ErrorEnum[400], "Language is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                // case !book.folder:
                //   throw await errorHandler.CustomError(ErrorEnum[400], "Folder is required");
                case !book.cover:
                    throw yield new CustomError_1.default(error_1.ErrorEnum[400], "Cover is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                case !book.uploader:
                    throw yield new CustomError_1.default(error_1.ErrorEnum[400], "Uploader is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                default:
                    return true;
            }
        });
    }
    formatBookData(book) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const formattedBook = {
                id: ((_a = book._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                title: book.title.trim(),
                description: ((_b = book.description) === null || _b === void 0 ? void 0 : _b.trim()) || "",
                category: book.category,
                authors: book.authors,
                languages: book.languages,
                cover: book.cover.trim(),
                meta: {
                    played: ((_c = book.meta) === null || _c === void 0 ? void 0 : _c.played) || 0,
                    views: ((_d = book.meta) === null || _d === void 0 ? void 0 : _d.views) || 0,
                    likes: ((_e = book.meta) === null || _e === void 0 ? void 0 : _e.likes) || 0,
                    dislikes: ((_f = book.meta) === null || _f === void 0 ? void 0 : _f.dislikes) || 0,
                    comments: ((_g = book.meta) === null || _g === void 0 ? void 0 : _g.comments) || 0,
                },
            };
            return formattedBook;
        });
    }
}
exports.default = new BookService();
