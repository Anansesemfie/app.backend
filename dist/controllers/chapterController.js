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
exports.getChapter = exports.getChapters = void 0;
const chapterService_1 = __importDefault(require("../services/chapterService"));
const getChapters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const token = res.locals.sessionId;
        const chapters = yield chapterService_1.default.fetchChapters(bookId, token);
        res.status(200).json({ data: chapters });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getChapters = getChapters;
const getChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapter = yield chapterService_1.default.fetchChapter(req.params.chapterId);
        res.status(200).json({ data: chapter });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getChapter = getChapter;
