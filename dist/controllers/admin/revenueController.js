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
exports.GetBookRevenue = exports.GetSummary = void 0;
const CustomError_1 = require("../../utils/CustomError");
const revenueService_1 = __importDefault(require("../../services/admin/revenueService"));
const GetSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const summary = yield revenueService_1.default.getSummary(token);
        res.status(200).json({ data: summary });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetSummary = GetSummary;
const GetBookRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const bookId = req.params.bookId;
        const revenue = yield revenueService_1.default.getBookRevenue(bookId, token);
        res.status(200).json({ data: revenue });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetBookRevenue = GetBookRevenue;
