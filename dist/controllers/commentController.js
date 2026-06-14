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
exports.reportComment = exports.deleteComment = exports.postReply = exports.getComments = exports.postComment = void 0;
const CustomError_1 = require("../utils/CustomError");
const commentService_1 = __importDefault(require("../services/commentService"));
const reportService_1 = __importDefault(require("../services/reportService"));
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId, comment } = req.body;
        const sessionID = res.locals.sessionId;
        const newComment = yield commentService_1.default.createComment({
            comment,
            sessionID,
            bookID: bookId,
        });
        res.status(201).json({ data: newComment });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.postComment = postComment;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const comments = yield commentService_1.default.getComments(bookId, { page, limit });
        res.status(200).json({ data: comments });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getComments = getComments;
const postReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parentId = req.params.commentId;
        const { bookId, comment } = req.body;
        const sessionID = res.locals.sessionId;
        const newReply = yield commentService_1.default.createComment({
            comment,
            sessionID,
            bookID: bookId,
            parentId,
        });
        res.status(201).json({ data: newReply });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.postReply = postReply;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.commentId;
        const sessionID = res.locals.sessionId;
        yield commentService_1.default.deleteComment(commentId, sessionID);
        res.status(200).json({ data: { message: "Comment deleted successfully" } });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.deleteComment = deleteComment;
const reportComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.commentId;
        const { reason } = req.body;
        const sessionID = res.locals.sessionId;
        yield reportService_1.default.reportComment({
            commentID: commentId,
            sessionID,
            reason,
        });
        res.status(200).json({ data: { message: "Comment reported successfully" } });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.reportComment = reportComment;
