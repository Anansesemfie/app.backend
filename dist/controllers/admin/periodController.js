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
exports.DeactivatePeriod = exports.FetchAllPeriods = exports.FetchLatestPeriod = exports.FetchPeriod = exports.UpdatePeriod = exports.CreatePeriod = void 0;
const periodService_1 = __importDefault(require("../../services/periodService"));
const CustomError_1 = require("../../utils/CustomError");
const CreatePeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const period = req.body;
        const createdPeriod = yield periodService_1.default.create(period);
        res.status(200).json({ data: createdPeriod });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.CreatePeriod = CreatePeriod;
const UpdatePeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const periodId = req.params.id;
        const period = req.body;
        const updatedPeriod = yield periodService_1.default.update(periodId, period);
        res.status(200).json({ data: updatedPeriod });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.UpdatePeriod = UpdatePeriod;
const FetchPeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const periodId = req.params.id;
        const fetchedPeriod = yield periodService_1.default.fetchOne(periodId);
        res.status(200).json({ data: fetchedPeriod });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchPeriod = FetchPeriod;
const FetchLatestPeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestPeriod = yield periodService_1.default.fetchLatest();
        res.status(200).json({ data: latestPeriod });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchLatestPeriod = FetchLatestPeriod;
const FetchAllPeriods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const periods = yield periodService_1.default.fetchAll();
        res.status(200).json({ data: periods });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchAllPeriods = FetchAllPeriods;
const DeactivatePeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const periodId = req.params.id;
        const deactivatedPeriod = yield periodService_1.default.deactivate(periodId);
        res.status(200).json({ data: deactivatedPeriod });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.DeactivatePeriod = DeactivatePeriod;
