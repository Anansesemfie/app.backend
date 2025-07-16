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
class PeriodRepository {
    create(period) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Periods.create(period);
        });
    }
    fetchOne(periodId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedPeriod = yield models_1.Periods.findOne({
                _id: periodId,
            });
            return fetchedPeriod;
        });
    }
    fetchLatest() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedPeriod = yield models_1.Periods.findOne({ active: true }).sort({
                createdAt: -1,
            });
            return fetchedPeriod;
        });
    }
    update(periodId, period) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedPeriod = yield models_1.Periods.findOneAndUpdate({ _id: periodId }, period, { new: true });
            return updatedPeriod;
        });
    }
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedPeriods = yield models_1.Periods.find().sort({ createdAt: -1 });
            return fetchedPeriods;
        });
    }
    delete(periodId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Periods.findByIdAndDelete(periodId);
        });
    }
}
exports.default = new PeriodRepository();
