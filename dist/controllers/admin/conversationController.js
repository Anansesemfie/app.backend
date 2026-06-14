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
exports.UpdateReportStatus = exports.GetReports = exports.DeleteComment = exports.GetComments = void 0;
const CustomError_1 = require("../../utils/CustomError");
const conversationService_1 = __importDefault(require("../../services/admin/conversationService"));
const reportService_1 = __importDefault(require("../../services/reportService"));
const GetComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = res.locals.sessionId;
        const page = parseInt((_a = req.query.page) !== null && _a !== void 0 ? _a : "1", 10) || 1;
        const limit = parseInt((_b = req.query.limit) !== null && _b !== void 0 ? _b : "20", 10) || 20;
        const bookId = req.query.bookId;
        const data = yield conversationService_1.default.getComments(token, { page, limit, bookId });
        res.status(200).json({ data });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetComments = GetComments;
const DeleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const id = req.params.id;
        const result = yield conversationService_1.default.deleteComment(token, id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.DeleteComment = DeleteComment;
const GetReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const page = parseInt((_a = req.query.page) !== null && _a !== void 0 ? _a : "1", 10) || 1;
        const limit = parseInt((_b = req.query.limit) !== null && _b !== void 0 ? _b : "20", 10) || 20;
        const data = yield reportService_1.default.getReports({ page, limit });
        res.status(200).json({ data });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetReports = GetReports;
const UpdateReportStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { status } = req.body;
        yield reportService_1.default.updateReportStatus(id, status);
        res.status(200).json({ data: { message: "Report status updated" } });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.UpdateReportStatus = UpdateReportStatus;
