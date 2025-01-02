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
class SubscriberRepository {
    create(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Subscriber.create(subscription);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedSubscription = yield models_1.Subscriber.findOne(Object.assign({}, params));
                return fetchedSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(subscription, subscriptionID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSubscription = yield models_1.Subscriber.findOneAndUpdate({ _id: subscriptionID }, subscription, {
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
exports.default = new SubscriberRepository();