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
exports.getSubscriptions = exports.getSubscription = void 0;
const subscriptionsService_1 = __importDefault(require("../services/subscriptionsService"));
const CustomError_1 = require("../utils/CustomError");
const getSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptionId = req.params.subscriptionId;
        const subscription = yield subscriptionsService_1.default.fetchOne(subscriptionId);
        res.status(200).json({ data: subscription });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getSubscription = getSubscription;
const getSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptions = yield subscriptionsService_1.default.fetchAllSubscriptions();
        res.status(200).json({ data: subscriptions });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.getSubscriptions = getSubscriptions;
