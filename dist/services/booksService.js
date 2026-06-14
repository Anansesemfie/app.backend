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
const subscriptionsService_1 = __importDefault(require("./subscriptionsService"));
const chapterService_1 = __importDefault(require("./chapterService"));
const reactionService_1 = __importDefault(require("./reactionService"));
const cacheService_1 = require("./utils/cacheService");
const helpers_1 = __importDefault(require("../utils/helpers"));
const error_1 = require("../utils/error");
const utils_1 = require("../db/models/utils");
const CustomError_1 = __importStar(require("../utils/CustomError"));
const richText_1 = require("../utils/richText");
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
            book.description = (0, richText_1.sanitizeHtml)(book.description);
            const valid = yield this.validateBookData(book);
            if (!valid) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Invalid book data", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const newBook = yield booksRepository_1.default.create(book);
            yield cacheService_1.CacheService.clearPattern("books:*");
            return this.formatBookData(newBook, true);
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
            yield cacheService_1.CacheService.clearPattern("books:*");
        });
    }
    //write a function that validates book data
    fetchBooks(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, token = "", params = {}, isAdmin = false, }) {
            const cacheKey = `books:list:p:${page}:l:${limit}:t:${token}:admin:${isAdmin}:params:${JSON.stringify(params)}`;
            const cached = yield cacheService_1.CacheService.get(cacheKey);
            if (cached)
                return cached;
            let books = [];
            if (token) {
                const booksToFetch = (yield this.fetchBooksInSubscription(token)) || [];
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
            const formattedBooks = yield Promise.all(books.map((book) => this.formatBookData(book, isAdmin)));
            const result = { books: formattedBooks, page, limit };
            yield cacheService_1.CacheService.set(cacheKey, result, 1800); // 30 mins
            return result;
        });
    }
    fetchBook(bookId_1) {
        return __awaiter(this, arguments, void 0, function* (bookId, sessionId = "", isAdmin = false) {
            if (!bookId) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book ID", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const cacheKey = `books:one:id:${bookId}:s:${sessionId}:admin:${isAdmin}`;
            const cached = yield cacheService_1.CacheService.get(cacheKey);
            if (cached) {
                if (sessionId) {
                    const { user } = yield sessionService_1.default.getSession(sessionId);
                    yield seenService_1.default.createNewSeen(bookId, user._id);
                }
                return cached;
            }
            if (sessionId) {
                const { user } = yield sessionService_1.default.getSession(sessionId);
                const booksToFetch = (yield this.fetchBooksInSubscription(sessionId)) || [];
                if (booksToFetch.length && !booksToFetch.includes(bookId)) {
                    throw new CustomError_1.default(error_1.ErrorEnum[403], "Unauthorized access", CustomError_1.ErrorCodes.FORBIDDEN);
                }
                yield seenService_1.default.createNewSeen(bookId, user._id);
            }
            const book = yield booksRepository_1.default.fetchOne(bookId);
            if (!book) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Book not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            const formattedBook = yield this.formatBookData(book, isAdmin);
            yield cacheService_1.CacheService.set(cacheKey, formattedBook, 1800);
            return formattedBook;
        });
    }
    updateBook(bookID_1, book_1) {
        return __awaiter(this, arguments, void 0, function* (bookID, book, isAdmin = false) {
            if (!bookID) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book ID", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            if (book.description)
                book.description = (0, richText_1.sanitizeHtml)(book.description);
            const updatedBook = yield booksRepository_1.default.update(bookID, book);
            yield cacheService_1.CacheService.clearPattern("books:*");
            return this.formatBookData(updatedBook, isAdmin);
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
            yield this.updateBook(bookId, book, false);
            // updateBook calls clearPattern("books:*")
        });
    }
    fetchBooksInSubscription(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            if (!user || !user.subscription) {
                return [];
            }
            const subscription = yield subscribersService_1.default.fetchOne({
                _id: user.subscription,
            });
            if (!subscription || !subscription.parent) {
                return [];
            }
            const parentSubscription = yield subscriptionsService_1.default.fetchOne(subscription.parent);
            return (parentSubscription === null || parentSubscription === void 0 ? void 0 : parentSubscription.books) || [];
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
                    dislikes: "dislikes",
                    views: "views",
                    played: "played",
                };
                const key = metaMap[meta];
                if (!key) {
                    throw new CustomError_1.default(error_1.ErrorEnum[500], "Invalid action", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
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
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, search, language, category, genre, author, narrator, token = "", isAdmin = false, }) {
            const cacheKey = `books:filter:s:${search}:l:${language}:c:${category}:g:${genre}:a:${author}:n:${narrator}:p:${page}:limit:${limit}:t:${token}:admin:${isAdmin}`;
            const cached = yield cacheService_1.CacheService.get(cacheKey);
            if (cached)
                return cached;
            const books = [];
            try {
                const params = { status: utils_1.BookStatus.Active };
                const normalize = (val) => {
                    if (!val)
                        return [];
                    if (Array.isArray(val))
                        return val;
                    return String(val)
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean);
                };
                if (search) {
                    params["title"] = { $regex: search, $options: "i" };
                }
                const languages = normalize(language);
                if (languages.length > 0) {
                    params["languages"] = { $in: languages };
                }
                const categories = normalize(category);
                if (categories.length > 0) {
                    params["category"] = { $in: categories };
                }
                const genres = normalize(genre);
                if (genres.length > 0) {
                    params["genres"] = { $in: genres };
                }
                const authors = normalize(author);
                if (authors.length > 0) {
                    params["authors"] = { $in: authors };
                }
                const narrators = normalize(narrator);
                if (narrators.length > 0) {
                    params["narrators"] = { $in: narrators };
                }
                const fetchByBooks = yield booksRepository_1.default.fetchAll(limit, page, params);
                const uniqueBooks = this.getUniqueBooks(fetchByBooks);
                const formatBooks = yield Promise.all(uniqueBooks.map((book) => this.formatBookData(book, isAdmin)));
                books.push(...formatBooks);
                yield cacheService_1.CacheService.set(cacheKey, books, 1800);
                return books;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getLikedBooksByUser(sessionId_1) {
        return __awaiter(this, arguments, void 0, function* (sessionId, isAdmin = false) {
            const cacheKey = `books:liked:s:${sessionId}:admin:${isAdmin}`;
            const cached = yield cacheService_1.CacheService.get(cacheKey);
            if (cached)
                return cached;
            const { user } = yield sessionService_1.default.getSession(sessionId);
            const userId = user._id;
            const likedBookIds = yield reactionService_1.default.getUserReaction(userId);
            const likedBooks = [];
            for (const bookId of likedBookIds) {
                const book = yield booksRepository_1.default.fetchOne(bookId);
                if (book) {
                    likedBooks.push(yield this.formatBookData(book, isAdmin));
                }
            }
            yield cacheService_1.CacheService.set(cacheKey, likedBooks, 1800);
            return likedBooks;
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
                    throw new CustomError_1.default(error_1.ErrorEnum[400], "Title is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                case !book.category.length:
                    throw new CustomError_1.default(error_1.ErrorEnum[400], "Category is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                case !book.languages.length:
                    throw new CustomError_1.default(error_1.ErrorEnum[400], "Language is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                case !book.authors.length:
                    throw new CustomError_1.default(error_1.ErrorEnum[400], "Author is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                // case !book.folder:
                //   throw await errorHandler.CustomError(ErrorEnum[400], "Folder is required");
                case !book.cover:
                    throw new CustomError_1.default(error_1.ErrorEnum[400], "Cover is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                case !book.uploader:
                    throw new CustomError_1.default(error_1.ErrorEnum[400], "Uploader is required", CustomError_1.ErrorCodes.BAD_REQUEST);
                default:
                    return true;
            }
        });
    }
    formatBookData(book_1) {
        return __awaiter(this, arguments, void 0, function* (book, isAdmin = false) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const toAuthorResponse = (a) => {
                var _a, _b;
                if (typeof a === "object" && a !== null) {
                    return {
                        id: ((_a = a._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                        name: a.name || "",
                        bio: a.bio,
                        active: (_b = a.active) !== null && _b !== void 0 ? _b : true,
                    };
                }
                return {
                    id: (a === null || a === void 0 ? void 0 : a.toString()) || "",
                    name: (a === null || a === void 0 ? void 0 : a.toString()) || "",
                    bio: undefined,
                    active: true,
                };
            };
            const toNarratorResponse = (n) => {
                var _a, _b;
                if (typeof n === "object" && n !== null) {
                    return {
                        id: ((_a = n._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                        name: n.name || "",
                        bio: n.bio,
                        active: (_b = n.active) !== null && _b !== void 0 ? _b : true,
                    };
                }
                return {
                    id: (n === null || n === void 0 ? void 0 : n.toString()) || "",
                    name: (n === null || n === void 0 ? void 0 : n.toString()) || "",
                    bio: undefined,
                    active: true,
                };
            };
            const formatMetadata = (m) => {
                var _a, _b;
                if (!m)
                    return "";
                const isObject = typeof m === "object" && m !== null;
                if (isAdmin) {
                    return isObject ? ((_a = m._id) === null || _a === void 0 ? void 0 : _a.toString()) || m.toString() : m.toString();
                }
                return isObject
                    ? m.title || m.name || ((_b = m._id) === null || _b === void 0 ? void 0 : _b.toString()) || m.toString()
                    : m.toString();
            };
            const formattedBook = {
                id: ((_a = book._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                title: book.title.trim(),
                description: ((_b = book.description) === null || _b === void 0 ? void 0 : _b.trim()) || "",
                snippet: book.snippet,
                category: ((_c = book.category) === null || _c === void 0 ? void 0 : _c.map(formatMetadata)) || [],
                genres: ((_d = book.genres) === null || _d === void 0 ? void 0 : _d.map(formatMetadata)) || [],
                authors: (book.authors || []).map(toAuthorResponse),
                narrators: (book.narrators || []).map(toNarratorResponse),
                languages: ((_e = book.languages) === null || _e === void 0 ? void 0 : _e.map(formatMetadata)) || [],
                cover: book.cover.trim(),
                meta: {
                    played: ((_f = book.meta) === null || _f === void 0 ? void 0 : _f.played) || 0,
                    views: ((_g = book.meta) === null || _g === void 0 ? void 0 : _g.views) || 0,
                    likes: ((_h = book.meta) === null || _h === void 0 ? void 0 : _h.likes) || 0,
                    dislikes: ((_j = book.meta) === null || _j === void 0 ? void 0 : _j.dislikes) || 0,
                    comments: ((_k = book.meta) === null || _k === void 0 ? void 0 : _k.comments) || 0,
                },
            };
            return formattedBook;
        });
    }
}
exports.default = new BookService();
