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
exports.GetPulse = exports.GetStats = void 0;
const CustomError_1 = require("../../utils/CustomError");
const dashboardService_1 = __importDefault(require("../../services/admin/dashboardService"));
const GetStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const stats = yield dashboardService_1.default.getStats(token);
        res.status(200).json({ data: stats });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetStats = GetStats;
const GetPulse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = res.locals.sessionId;
        const days = parseInt((_a = req.query.days) !== null && _a !== void 0 ? _a : "14", 10) || 14;
        const pulse = yield dashboardService_1.default.getPulse(token, days);
        res.status(200).json({ data: pulse });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetPulse = GetPulse;
