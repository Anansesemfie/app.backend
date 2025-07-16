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
const periodRepository_1 = __importDefault(require("../db/repository/periodRepository"));
const error_1 = require("../utils/error");
const CustomError_1 = __importStar(require("../utils/CustomError"));
const helpers_1 = __importDefault(require("../utils/helpers"));
class PeriodService {
    create(period) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!period) {
                period = yield this.newPeriod();
            }
            this.checkPayload(period);
            const existingPeriod = yield this.fetchLatest();
            if (existingPeriod) {
                yield this.deactivate((_a = existingPeriod._id) !== null && _a !== void 0 ? _a : "");
            }
            const createdPeriod = yield periodRepository_1.default.create(period);
            return this.formatPeriod(createdPeriod);
        });
    }
    fetchOne(periodId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedPeriod = yield periodRepository_1.default.fetchOne(periodId);
            return yield this.formatPeriod(fetchedPeriod);
        });
    }
    fetchLatest() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedPeriod = yield periodRepository_1.default.fetchLatest();
            return fetchedPeriod;
        });
    }
    update(periodId, period) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!periodId) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Period ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const updatedPeriod = yield periodRepository_1.default.update(periodId, period);
            return yield this.formatPeriod(updatedPeriod);
        });
    }
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedPeriods = yield periodRepository_1.default.fetchAll();
            return Promise.all(fetchedPeriods.map((period) => this.formatPeriod(period)));
        });
    }
    deactivate(periodId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!periodId) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Period ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const updatedPeriod = yield this.update(periodId, {
                active: false,
                endDate: helpers_1.default.currentTime("YYYY-MM-DD"),
                updatedAt: new Date(),
            });
            return updatedPeriod;
        });
    }
    newPeriod() {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstDate, lastDate } = yield helpers_1.default.getFirstAndLastDateOfMonth();
            return {
                startDate: firstDate,
                endDate: lastDate,
                active: true,
                year: firstDate.getFullYear(),
                month: firstDate.getMonth() + 1, // JavaScript months are 0-indexed
            };
        });
    }
    checkPayload(period) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!period.startDate || !period.endDate) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Period start and end dates are required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            if (period.startDate > period.endDate) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Period start date cannot be after end date", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    formatPeriod(period) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            return {
                id: (_a = period._id) !== null && _a !== void 0 ? _a : "",
                startDate: period.startDate,
                endDate: period.endDate,
                status: period.active ? "active" : "inactive",
                createdAt: (_b = period.createdAt) !== null && _b !== void 0 ? _b : new Date(),
                updatedAt: (_c = period.updatedAt) !== null && _c !== void 0 ? _c : new Date(),
                year: period.year,
                month: period.month,
            };
        });
    }
}
exports.default = new PeriodService();
