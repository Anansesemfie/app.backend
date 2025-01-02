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
const subscriptionRepository_1 = __importDefault(require("../db/repository/subscriptionRepository"));
class SubscriptionService {
    constructor() {
        this.logInfo = "";
    }
    create(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield subscriptionRepository_1.default.create(subscription);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchOne(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedSubscription = yield subscriptionRepository_1.default.getOne(subscriptionId);
                return this.reformatSubscription(fetchedSubscription);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchAllSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedSubscriptions = yield subscriptionRepository_1.default.getList({
                    visible: true,
                    active: true,
                });
                const formatedSubscriptions = yield Promise.all(fetchedSubscriptions.map((subscription) => this.reformatSubscription(subscription)));
                return formatedSubscriptions;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(subscription, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSubscription = yield subscriptionRepository_1.default.update(subscription, subscriptionId);
                return updatedSubscription;
            }
            catch (error) {
                throw error;
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
