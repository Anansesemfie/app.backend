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
exports.GetBookAnalysis = exports.CreateChapter = exports.UpdateBook = exports.CreateBook = exports.GenerateSignedUrl = void 0;
const bookService_1 = __importDefault(require("../../services/admin/bookService"));
const chapterService_1 = __importDefault(require("../../services/admin/chapterService"));
const analysisService_1 = __importDefault(require("../../services/analysisService"));
const error_1 = __importDefault(require("../../utils/error"));
const GenerateSignedUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { file, fileType } = req.body;
        const token = res.locals.sessionId;
        const signedUrl = yield bookService_1.default.getAWSURL(file, fileType, token);
        res.status(200).json({ data: signedUrl });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.GenerateSignedUrl = GenerateSignedUrl;
const CreateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = req.body;
        const token = res.locals.sessionId;
        const createdBook = yield bookService_1.default.CreateBook(book, token);
        res.status(200).json({ data: createdBook });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.CreateBook = CreateBook;
const UpdateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = req.body;
        const token = res.locals.sessionId;
        const updatedBook = yield bookService_1.default.UpdateBook(book, token);
        res.status(200).json({ data: updatedBook });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.UpdateBook = UpdateBook;
//chapters
const CreateChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapter = req.body;
        const token = res.locals.sessionId;
        const createdChapter = yield chapterService_1.default.CreateChapter(chapter, token);
        res.status(200).json({ data: createdChapter });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.CreateChapter = CreateChapter;
const GetBookAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const start = req.query.startDate;
        const end = req.query.endDate;
        const token = res.locals.sessionId;
        const analysis = yield analysisService_1.default.analyzeBook(start, end, bookId);
        res.status(200).json({ data: analysis });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.GetBookAnalysis = GetBookAnalysis;
