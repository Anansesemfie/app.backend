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
class AppConfigRepository {
    /**
     * Returns the singleton config document, creating it with defaults if it
     * doesn't exist yet.
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield models_1.AppConfig.findOneAndUpdate({}, { $setOnInsert: { autoPeriodCreation: true } }, { upsert: true, new: true });
            return config;
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield models_1.AppConfig.findOneAndUpdate({}, data, {
                new: true,
                upsert: true,
            });
            return config;
        });
    }
}
exports.default = new AppConfigRepository();
