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
exports.getGenre = exports.toggleGenreActive = exports.getAllGenres = exports.deleteGenre = exports.updateGenre = exports.createGenre = void 0;
const genreService_1 = __importDefault(require("../../services/genreService"));
const CustomError_1 = require("../../utils/CustomError");
const createGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const sessionID = res.locals.sessionId;
        const result = yield genreService_1.default.createGenre(data, sessionID);
        res.status(201).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.createGenre = createGenre;
const updateGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const sessionID = res.locals.sessionId;
        const result = yield genreService_1.default.updateGenre(id, data, sessionID);
        res.status(200).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.updateGenre = updateGenre;
const deleteGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sessionID = res.locals.sessionId;
        yield genreService_1.default.deleteGenre(id, sessionID);
        res.status(204).send();
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.deleteGenre = deleteGenre;
const getAllGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1000;
        const search = req.query.search;
        const sort = { createdAt: -1 };
        const { genres, total, page: currentPage, limit: currentLimit } = yield genreService_1.default.fetchAllGenres({ page, limit, search, sort });
        res.status(200).json({ data: genres, total, page: currentPage, limit: currentLimit });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getAllGenres = getAllGenres;
const toggleGenreActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sessionID = res.locals.sessionId;
        const result = yield genreService_1.default.toggleGenreActive(id, sessionID);
        res.status(200).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.toggleGenreActive = toggleGenreActive;
const getGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield genreService_1.default.fetchGenre(id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getGenre = getGenre;
