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
exports.filterBooks = exports.getBook = exports.getBooks = void 0;
const booksService_1 = __importDefault(require("../services/booksService"));
const CustomError_1 = require("../utils/CustomError");
const helpers_1 = __importDefault(require("../utils/helpers"));
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        const token = (_a = res.locals.sessionId) !== null && _a !== void 0 ? _a : '';
        helpers_1.default.LOG({ token });
        const { books, page: index, limit: pageSize } = yield booksService_1.default.fetchBooks({
            page,
            limit,
            params: { title: { $regex: search } },
            token,
        });
        res
            .status(200)
            .json({ data: { page: index, records: pageSize, results: books } });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getBooks = getBooks;
const getBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const sessionId = res.locals.sessionId;
        const book = yield booksService_1.default.fetchBook(bookId, sessionId);
        res.status(200).json({ data: book });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getBook = getBook;
const filterBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.query.search;
        const language = req.query.language;
        const category = req.query.category;
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const books = yield booksService_1.default.filterBooks({
            page,
            limit,
            search,
            language,
            category,
        });
        res.status(200).json({ data: books });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.filterBooks = filterBooks;
