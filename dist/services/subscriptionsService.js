"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const error_1 = require("../utils/error");
const subscriptionRepository_1 = __importDefault(require("../db/repository/subscriptionRepository"));
const CustomError_1 = __importStar(require("../utils/CustomError"));
class SubscriptionService {
    constructor() {
        this.logInfo = "";
    }
    create(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkPayload(subscription);
            return yield subscriptionRepository_1.default.create(subscription);
        });
    }
    fetchOne(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedSubscription = yield subscriptionRepository_1.default.getOne(subscriptionId);
            return this.reformatSubscription(fetchedSubscription);
        });
    }
    fetchAllSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedSubscriptions = yield subscriptionRepository_1.default.getList({
                visible: true,
                active: true,
            });
            const formatedSubscriptions = yield Promise.all(fetchedSubscriptions.map((subscription) => this.reformatSubscription(subscription)));
            return formatedSubscriptions;
        });
    }
    update(subscription, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!subscriptionId) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Subscription ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            yield this.checkPayload(subscription);
            const updatedSubscription = yield subscriptionRepository_1.default.update(subscription, subscriptionId);
            return updatedSubscription;
        });
    }
    checkPayload(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!subscription.name || !subscription.amount) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Subscription name and amount are required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            if (subscription.duration < 1) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Invalid subscription duration", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            if (subscription.autorenew && typeof subscription.autorenew !== "boolean") {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Autorenew must be a boolean value", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    reformatSubscription(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const formatedSubscription = {
                id: subscription._id,
                name: subscription.name,
                active: subscription.active,
                visible: subscription.visible,
                duration: subscription.duration,
                users: subscription.users,
                autorenew: subscription.autorenew,
                amount: subscription.amount,
                origin: subscription.origin,
                accent: subscription.accent,
                createdAt: subscription.createdAt,
            };
            return formatedSubscription;
        });
    }
}
exports.default = new SubscriptionService();
