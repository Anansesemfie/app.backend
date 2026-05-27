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
const dayjs_1 = __importDefault(require("dayjs"));
const models_1 = require("../../db/models");
const sessionService_1 = __importDefault(require("../sessionService"));
const CustomError_1 = __importStar(require("../../utils/CustomError"));
const error_1 = require("../../utils/error");
const utils_1 = require("../../db/models/utils");
class RevenueService {
    assertAdmin(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            if (!user || user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Forbidden", CustomError_1.ErrorCodes.FORBIDDEN);
            }
        });
    }
    getSummary(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(token);
            const grouped = yield models_1.Subscriber.aggregate([
                { $match: { active: true } },
                { $group: { _id: "$parent", count: { $sum: 1 } } },
            ]);
            const planIds = grouped.map((g) => g._id);
            const plans = yield models_1.Subscription.find({ _id: { $in: planIds } }, "name amount duration");
            const byPlan = grouped.map((g) => {
                const plan = plans.find((p) => { var _a; return p._id.toString() === ((_a = g._id) === null || _a === void 0 ? void 0 : _a.toString()); });
                const amount = plan ? plan.amount : 0;
                const durationMs = plan ? plan.duration : 2592000000;
                const months = durationMs / 2592000000;
                const monthlyRate = amount / months;
                const contribution = Math.round(monthlyRate * g.count);
                return {
                    name: plan ? plan.name : "Unknown",
                    amount,
                    count: g.count,
                    contribution,
                };
            });
            const mrr = byPlan.reduce((sum, p) => sum + p.contribution, 0);
            const totalActiveSubscribers = byPlan.reduce((sum, p) => sum + p.count, 0);
            return { mrr, totalActiveSubscribers, byPlan };
        });
    }
    getBookRevenue(bookId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            const isAdmin = user.account === utils_1.UsersTypes.admin;
            if (!isAdmin) {
                if (!user.organization) {
                    throw new CustomError_1.default(error_1.ErrorEnum[403], "Forbidden", CustomError_1.ErrorCodes.FORBIDDEN);
                }
                const book = yield models_1.Book.findById(bookId, "organization");
                if (!book ||
                    String(book.organization) !== String(user.organization)) {
                    throw new CustomError_1.default(error_1.ErrorEnum[403], "Forbidden", CustomError_1.ErrorCodes.FORBIDDEN);
                }
            }
            // Active subscribers whose subscription includes this book
            const subscribers = yield models_1.Subscriber
                .find({ active: true, books: bookId })
                .populate("parent", "amount duration name");
            let totalRevenue = 0;
            const totalSubscribers = subscribers.length;
            for (const sub of subscribers) {
                const plan = sub.parent;
                if (plan && plan.amount) {
                    totalRevenue += plan.amount;
                }
            }
            if (!isAdmin) {
                return { totalRevenue, totalSubscribers };
            }
            // Admin: full breakdown grouped by activatedAt year-month
            const periodMap = {};
            for (const sub of subscribers) {
                const plan = sub.parent;
                const activatedAt = sub.activatedAt;
                const periodKey = activatedAt
                    ? (0, dayjs_1.default)(activatedAt).format("YYYY-MM")
                    : "unknown";
                if (!periodMap[periodKey]) {
                    periodMap[periodKey] = {
                        period: periodKey,
                        subscribers: 0,
                        revenue: 0,
                    };
                }
                periodMap[periodKey].subscribers++;
                if (plan && plan.amount) {
                    periodMap[periodKey].revenue += plan.amount;
                }
            }
            const byPeriod = Object.values(periodMap).sort((a, b) => a.period.localeCompare(b.period));
            return { totalRevenue, totalSubscribers, byPeriod };
        });
    }
}
exports.default = new RevenueService();
