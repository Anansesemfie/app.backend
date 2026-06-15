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
exports.getNarrator = exports.getAllNarrators = exports.deleteNarrator = exports.updateNarrator = exports.createNarrator = void 0;
const narratorService_1 = __importDefault(require("../../services/narratorService"));
const CustomError_1 = require("../../utils/CustomError");
const createNarrator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const sessionID = res.locals.sessionId;
        const result = yield narratorService_1.default.createNarrator(data, sessionID);
        res.status(201).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.createNarrator = createNarrator;
const updateNarrator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const sessionID = res.locals.sessionId;
        const result = yield narratorService_1.default.updateNarrator(id, data, sessionID);
        res.status(200).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.updateNarrator = updateNarrator;
const deleteNarrator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sessionID = res.locals.sessionId;
        yield narratorService_1.default.deleteNarrator(id, sessionID);
        res.status(204).send();
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.deleteNarrator = deleteNarrator;
const getAllNarrators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1000;
        const search = req.query.search;
        const sort = { createdAt: -1 };
        const { narrators, total, page: currentPage, limit: currentLimit } = yield narratorService_1.default.fetchAllNarrators({ page, limit, search, sort });
        res.status(200).json({ data: narrators, total, page: currentPage, limit: currentLimit });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getAllNarrators = getAllNarrators;
const getNarrator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield narratorService_1.default.fetchNarrator(id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getNarrator = getNarrator;
