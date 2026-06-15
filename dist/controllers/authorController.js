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
exports.getAuthor = exports.getAuthors = void 0;
const authorService_1 = __importDefault(require("../services/authorService"));
const CustomError_1 = require("../utils/CustomError");
const getAuthors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1000;
        const search = req.query.search;
        const { authors, total, page: currentPage, limit: currentLimit } = yield authorService_1.default.fetchAllAuthors({ page, limit, search });
        res.status(200).json({ data: authors, total, page: currentPage, limit: currentLimit });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getAuthors = getAuthors;
const getAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield authorService_1.default.fetchAuthor(id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getAuthor = getAuthor;
