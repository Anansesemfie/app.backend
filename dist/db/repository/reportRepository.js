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
class ReportRepository {
    create(report) {
        return __awaiter(this, void 0, void 0, function* () {
            const newReport = yield models_1.Report.create(report);
            return newReport;
        });
    }
    fetchReports() {
        return __awaiter(this, arguments, void 0, function* ({ skip = 0, limit = 20 } = {}) {
            return models_1.Report.find()
                .populate("commentID", "comment")
                .populate("reporter", "username")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        });
    }
    countReports() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Report.countDocuments();
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Report.findByIdAndUpdate(id, { status });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Report.findById(id);
        });
    }
}
exports.default = new ReportRepository();
