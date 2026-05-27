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
exports.UpdateSettings = exports.GetSettings = void 0;
const appConfigService_1 = __importDefault(require("../../services/admin/appConfigService"));
const CustomError_1 = require("../../utils/CustomError");
const GetSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield appConfigService_1.default.get();
        res.status(200).json({ data: settings });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetSettings = GetSettings;
const UpdateSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const settings = yield appConfigService_1.default.update(data);
        res.status(200).json({ data: settings });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.UpdateSettings = UpdateSettings;
