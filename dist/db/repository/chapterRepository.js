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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const error_1 = __importStar(require("../../utils/error"));
class ChapterRepository {
    createChapter(chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const newChapter = new models_1.Chapter(chapter);
                yield newChapter.save();
                return newChapter;
            }
            catch (error) {
                console.log({ error });
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Error creating chapter");
            }
        });
    }
    getChapters(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chapters = yield models_1.Chapter.find({ book: bookId });
                return chapters;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error fetching chapters");
            }
        });
    }
    getChapterById(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chapter = yield models_1.Chapter.findOne({ _id: chapterId });
                return chapter;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error fetching chapter");
            }
        });
    }
    getChapterByTitle() {
        return __awaiter(this, arguments, void 0, function* (chapterTitle = "sample") {
            try {
                const chapter = yield models_1.Chapter.findOne({ title: chapterTitle });
                return chapter;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error fetching chapter");
            }
        });
    }
    searchByKeyword(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matchedBooks = yield models_1.Chapter.find({
                    title: { $regex: keyword, $options: "i" },
                });
                return matchedBooks;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error searching books");
            }
        });
    }
}
exports.default = new ChapterRepository();
