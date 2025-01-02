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
exports.ActivateSubscription = void 0;
const subscribersService_1 = __importDefault(require("../services/subscribersService"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const error_1 = __importDefault(require("../utils/error"));
const ActivateSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ref, reference } = req.query;
        helpers_1.default.LOG({ ref, reference });
        const response = yield subscribersService_1.default.verifySubscription((reference !== null && reference !== void 0 ? reference : ref));
        res.status(200).json({ data: response });
    }
    catch (error) {
        if (error instanceof Error) {
            return res
                .status(500)
                .json({ error: "Internal Server Error", message: error.message });
        }
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.ActivateSubscription = ActivateSubscription;
