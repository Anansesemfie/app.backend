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
exports.UpdateChapter = exports.DeleteChapter = exports.GetBookAnalysis = exports.CreateChapter = exports.DeleteBook = exports.UpdateBook = exports.CreateBook = exports.GenerateSignedUrl = void 0;
const bookService_1 = __importDefault(require("../../services/admin/bookService"));
const chapterService_1 = __importDefault(require("../../services/admin/chapterService"));
const analysisService_1 = __importDefault(require("../../services/analysisService"));
const CustomError_1 = require("../../utils/CustomError");
const GenerateSignedUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { file, fileType } = req.body;
        const token = res.locals.sessionId;
        const signedUrl = yield bookService_1.default.getAWSURL(file, fileType, token);
        res.status(200).json({ data: signedUrl });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GenerateSignedUrl = GenerateSignedUrl;
const CreateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = req.body;
        const token = res.locals.sessionId;
        const createdBook = yield bookService_1.default.CreateBook(book, token);
        res.status(201).json({ data: createdBook });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.CreateBook = CreateBook;
const UpdateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = req.body;
        const bookId = req.params.id;
        const token = res.locals.sessionId;
        const updatedBook = yield bookService_1.default.UpdateBook(bookId, book, token);
        res.status(203).json({ data: updatedBook });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.UpdateBook = UpdateBook;
const DeleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.id;
        const token = res.locals.sessionId;
        const update = yield bookService_1.default.DeleteBook(bookId, token);
        res.status(200).json({ data: update });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.DeleteBook = DeleteBook;
//chapters
const CreateChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapter = req.body;
        const token = res.locals.sessionId;
        const createdChapter = yield chapterService_1.default.CreateChapter(chapter, token);
        res.status(201).json({ data: createdChapter });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.CreateChapter = CreateChapter;
const GetBookAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const period = req.query.period;
        const analysis = yield analysisService_1.default.analyzeBook(bookId, period);
        res.status(200).json({ data: analysis });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetBookAnalysis = GetBookAnalysis;
const DeleteChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const token = res.locals.sessionId;
        const result = yield chapterService_1.default.deleteChapter(id, token);
        res.status(200).json(result);
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.DeleteChapter = DeleteChapter;
const UpdateChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const chapter = req.body;
        const token = res.locals.sessionId;
        const result = yield chapterService_1.default.updateChapter(id, chapter, token);
        res.status(203).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.UpdateChapter = UpdateChapter;
