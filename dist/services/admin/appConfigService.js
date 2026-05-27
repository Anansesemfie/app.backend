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
const appConfigRepository_1 = __importDefault(require("../../db/repository/appConfigRepository"));
class AppConfigService {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield appConfigRepository_1.default.get();
            return this.format(config);
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield appConfigRepository_1.default.update(data);
            return this.format(config);
        });
    }
    /**
     * Used by the cron job to check the flag without going through HTTP.
     */
    isAutoPeriodCreationEnabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield appConfigRepository_1.default.get();
            return config.autoPeriodCreation;
        });
    }
    format(config) {
        var _a, _b, _c;
        return {
            id: (_a = config._id) !== null && _a !== void 0 ? _a : "",
            autoPeriodCreation: config.autoPeriodCreation,
            createdAt: (_b = config.createdAt) !== null && _b !== void 0 ? _b : new Date(),
            updatedAt: (_c = config.updatedAt) !== null && _c !== void 0 ? _c : new Date(),
        };
    }
}
exports.default = new AppConfigService();
