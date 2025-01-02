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
exports.getComments = exports.postComment = void 0;
const commentService_1 = __importDefault(require("../services/commentService"));
const error_1 = __importDefault(require("../utils/error"));
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId, comment } = req.body;
        const sessionID = res.locals.sessionId;
        const newComment = yield commentService_1.default.createComment({
            comment: comment,
            sessionID: sessionID,
            bookID: bookId,
        });
        res.status(201).json({ data: newComment });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.postComment = postComment;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const comments = yield commentService_1.default.getComments(bookId);
        res.status(200).json({ data: comments });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.getComments = getComments;
