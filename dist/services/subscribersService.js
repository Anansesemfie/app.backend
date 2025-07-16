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
const subscribersRepository_1 = __importDefault(require("../db/repository/subscribersRepository"));
const subscriptionsService_1 = __importDefault(require("./subscriptionsService"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const error_1 = require("../utils/error");
const paystack_1 = __importDefault(require("../utils/paystack"));
const env_1 = require("../utils/env");
const CustomError_1 = __importStar(require("../utils/CustomError"));
const dayjs_1 = __importDefault(require("dayjs"));
class SubscriberService {
    constructor() {
        this.logInfo = "";
    }
    create(parent_1, user_1) {
        return __awaiter(this, arguments, void 0, function* (parent, user, books = []) {
            if (!parent || !user) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Parent subscription ID and user are required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const parentSubscription = yield subscriptionsService_1.default.fetchOne(parent);
            if (!parentSubscription) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Parent subscription not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            const subscription = {
                parent,
                active: false,
                books,
                ref: `temp(${helpers_1.default.genRandCode()})`,
                user: user._id,
            };
            const newSubscription = yield subscribersRepository_1.default.create(subscription);
            if (!newSubscription) {
                throw new CustomError_1.default(error_1.ErrorEnum[500], "Failed to create subscription", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
            }
            const callback_url = `${env_1.APP_BASE_URL}/api/v1/subscribers/callback`;
            if (parentSubscription.amount === 0) {
                yield this.update({ active: true, activatedAt: helpers_1.default.currentTime() }, newSubscription._id);
                this.logInfo = `${helpers_1.default.loggerInfo.success} creating start up subscription @ ${helpers_1.default.currentTime()}`;
                return {
                    paymentDetails: {},
                    subscription: newSubscription,
                };
            }
            else {
                const paystackResponse = yield paystack_1.default.initializeTransaction(parentSubscription.amount, user.email, {
                    customer: {
                        id: user._id,
                        name: user.username,
                    },
                    subscription: {
                        id: newSubscription._id,
                        duration: parentSubscription.duration,
                    },
                }, callback_url);
                yield this.update({ ref: paystackResponse.data.reference }, newSubscription._id);
                this.logInfo = `${helpers_1.default.loggerInfo.success} creating subscription @ ${helpers_1.default.currentTime()}`;
                return {
                    paymentDetails: paystackResponse,
                    subscription: newSubscription,
                };
            }
        });
    }
    verifySubscription(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = (0, dayjs_1.default)(new Date()).toISOString();
            if (!ref) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Reference is required for verification", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            yield paystack_1.default.verifyTransaction(ref);
            const subscription = yield subscribersRepository_1.default.fetchOne({ ref });
            if (!subscription) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Subscription not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            if (subscription.active) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Subscription is already active", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const updatedSubscription = yield this.update({ active: true, activatedAt: today, updatedAt: today }, subscription._id);
            this.logInfo = `${helpers_1.default.loggerInfo.success} verifying subscription @ ${helpers_1.default.currentTime()}`;
            return updatedSubscription;
        });
    }
    fetchOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedSubscription = yield subscribersRepository_1.default.fetchOne(Object.assign({}, params));
            if (!fetchedSubscription) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Subscription not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            return fetchedSubscription !== null && fetchedSubscription !== void 0 ? fetchedSubscription : {};
        });
    }
    update(subscription, subscriptionID) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedSubscription = yield subscribersRepository_1.default.update(Object.assign({}, subscription), subscriptionID);
            return updatedSubscription;
        });
    }
    validateSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const child = yield this.fetchOne({ _id: String(subscriptionId) });
            const parent = yield subscriptionsService_1.default.fetchOne(child.parent);
            const duration = helpers_1.default.millisecondsToDays(parent.duration);
            const daysGone = helpers_1.default.countDaysBetweenDates(child === null || child === void 0 ? void 0 : child.createdAt, helpers_1.default.currentTime());
            return daysGone <= duration;
        });
    }
}
exports.default = new SubscriberService();
