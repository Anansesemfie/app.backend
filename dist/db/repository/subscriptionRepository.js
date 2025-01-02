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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const excludedFields = "-__v";
class SubscriptionsRepository {
    create(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Subscription.create(subscription);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOne(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield models_1.Subscription.findOne({
                    _id: subscriptionId,
                });
                return subscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptions = yield models_1.Subscription.find(Object.assign({}, params));
                return subscriptions;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(subscription, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSubscription = yield models_1.Subscription.findOneAndUpdate({ _id: subscriptionId }, subscription, {
                    new: true,
                });
                return updatedSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new SubscriptionsRepository();
