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
exports.ToggleOriginActive = exports.UpdateOrigin = exports.CreateOrigin = exports.GetOrigin = exports.ListOrigins = void 0;
const CustomError_1 = require("../../utils/CustomError");
const originsService_1 = __importDefault(require("../../services/admin/originsService"));
const ListOrigins = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const origins = yield originsService_1.default.list(token);
        res.status(200).json({ data: origins });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.ListOrigins = ListOrigins;
const GetOrigin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const { id } = req.params;
        const origin = yield originsService_1.default.getOne(token, id);
        res.status(200).json({ data: origin });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetOrigin = GetOrigin;
const CreateOrigin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const origin = yield originsService_1.default.create(token, req.body);
        res.status(201).json({ data: origin });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.CreateOrigin = CreateOrigin;
const UpdateOrigin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const { id } = req.params;
        const origin = yield originsService_1.default.update(token, id, req.body);
        res.status(200).json({ data: origin });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.UpdateOrigin = UpdateOrigin;
const ToggleOriginActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const { id } = req.params;
        const origin = yield originsService_1.default.toggleActive(token, id);
        res.status(200).json({ data: origin });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.ToggleOriginActive = ToggleOriginActive;
