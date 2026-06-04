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
exports.FetchActiveQuotes = exports.FetchQuote = exports.FetchAllQuotes = exports.DeleteQuote = exports.UpdateQuote = exports.CreateQuote = void 0;
const quoteService_1 = __importDefault(require("../../services/admin/quoteService"));
const CustomError_1 = require("../../utils/CustomError");
const CreateQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quote = req.body;
        const token = res.locals.sessionId;
        const createdQuote = yield quoteService_1.default.CreateQuote(quote, token);
        res.status(201).json({ data: createdQuote });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.CreateQuote = CreateQuote;
const UpdateQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quote = req.body;
        const quoteId = req.params.id;
        const token = res.locals.sessionId;
        const updatedQuote = yield quoteService_1.default.UpdateQuote(quoteId, quote, token);
        res.status(203).json({ data: updatedQuote });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.UpdateQuote = UpdateQuote;
const DeleteQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quoteId = req.params.id;
        const token = res.locals.sessionId;
        const result = yield quoteService_1.default.DeleteQuote(quoteId, token);
        res.status(200).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.DeleteQuote = DeleteQuote;
const FetchAllQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const quotes = yield quoteService_1.default.FetchAllQuotes(token, limit, page);
        res.status(200).json({ data: quotes });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchAllQuotes = FetchAllQuotes;
const FetchQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quoteId = req.params.id;
        const token = res.locals.sessionId;
        const quote = yield quoteService_1.default.FetchQuote(quoteId, token);
        res.status(200).json({ data: quote });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchQuote = FetchQuote;
const FetchActiveQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quotes = yield quoteService_1.default.FetchActiveQuotes();
        res.status(200).json({ data: quotes });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchActiveQuotes = FetchActiveQuotes;
