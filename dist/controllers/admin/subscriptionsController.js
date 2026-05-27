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
exports.DeleteSubscription = exports.UpdateSubscription = exports.CreateSubscription = exports.ListSubscriptions = exports.GetStats = void 0;
const CustomError_1 = require("../../utils/CustomError");
const subscriptionsService_1 = __importDefault(require("../../services/admin/subscriptionsService"));
const GetStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const stats = yield subscriptionsService_1.default.getStats(token);
        res.status(200).json({ data: stats });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.GetStats = GetStats;
const ListSubscriptions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const subscriptions = yield subscriptionsService_1.default.list(token);
        res.status(200).json({ data: subscriptions });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.ListSubscriptions = ListSubscriptions;
const CreateSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const subscription = yield subscriptionsService_1.default.create(token, req.body);
        res.status(201).json({ data: subscription });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.CreateSubscription = CreateSubscription;
const UpdateSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const { id } = req.params;
        const subscription = yield subscriptionsService_1.default.update(token, id, req.body);
        res.status(200).json({ data: subscription });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.UpdateSubscription = UpdateSubscription;
const DeleteSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = res.locals.sessionId;
        const { id } = req.params;
        const subscription = yield subscriptionsService_1.default.delete(token, id);
        res.status(200).json({ data: subscription });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.DeleteSubscription = DeleteSubscription;
