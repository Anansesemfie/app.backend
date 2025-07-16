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
exports.dislikeBook = exports.likeBook = void 0;
const reactionService_1 = __importDefault(require("../services/reactionService"));
const CustomError_1 = require("../utils/CustomError");
const likeBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const sessionId = res.locals.sessionId;
        const reaction = yield reactionService_1.default.createReaction({
            sessionID: sessionId,
            bookID: bookId,
            action: "Liked",
        });
        res.status(200).json({ data: reaction });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.likeBook = likeBook;
const dislikeBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const sessionId = res.locals.sessionId;
        const reaction = yield reactionService_1.default.createReaction({
            sessionID: sessionId,
            bookID: bookId,
            action: "Disliked",
        });
        res.status(200).json({ data: reaction });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.dislikeBook = dislikeBook;
