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
const error_1 = __importDefault(require("../utils/error"));
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const search = req.query.search;
        const token = res.locals.sessionId;
        const books = yield booksService_1.default.fetchBooks({
            page: parseInt(page),
            limit: parseInt(limit),
            params: { title: { $regex: search } },
            token,
        });
        res
            .status(200)
            .json({ data: { page: page, records: limit, results: books } });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
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
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
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
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.filterBooks = filterBooks;
