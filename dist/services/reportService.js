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
const reportRepository_1 = __importDefault(require("../db/repository/reportRepository"));
const sessionService_1 = __importDefault(require("./sessionService"));
const CustomError_1 = __importStar(require("../utils/CustomError"));
const error_1 = require("../utils/error");
class ReportService {
    reportComment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ commentID, sessionID, reason, }) {
            if (!commentID || !sessionID || !reason) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Comment ID, session and reason are required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const { session } = yield sessionService_1.default.getSession(sessionID);
            const newReport = yield reportRepository_1.default.create({
                commentID,
                reporter: session === null || session === void 0 ? void 0 : session.user,
                reason,
                status: "pending",
            });
            return newReport;
        });
    }
    getReports() {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 20 } = {}) {
            const skip = (page - 1) * limit;
            const [reports, total] = yield Promise.all([
                reportRepository_1.default.fetchReports({ skip, limit }),
                reportRepository_1.default.countReports(),
            ]);
            const results = reports.map((r) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    id: String(r._id),
                    comment: {
                        id: String((_a = r.commentID) === null || _a === void 0 ? void 0 : _a._id),
                        text: (_c = (_b = r.commentID) === null || _b === void 0 ? void 0 : _b.comment) !== null && _c !== void 0 ? _c : "[Deleted]",
                    },
                    reporter: {
                        id: String((_d = r.reporter) === null || _d === void 0 ? void 0 : _d._id),
                        username: (_f = (_e = r.reporter) === null || _e === void 0 ? void 0 : _e.username) !== null && _f !== void 0 ? _f : "Anonymous",
                    },
                    reason: r.reason,
                    status: r.status,
                    createdAt: String(r.createdAt),
                });
            });
            return {
                page,
                limit,
                total,
                results,
            };
        });
    }
    updateReportStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield reportRepository_1.default.findById(id);
            if (!report) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Report not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            yield reportRepository_1.default.updateStatus(id, status);
        });
    }
}
exports.default = new ReportService();
