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
const models_1 = require("../../db/models");
const sessionService_1 = __importDefault(require("../sessionService"));
const CustomError_1 = __importStar(require("../../utils/CustomError"));
const error_1 = require("../../utils/error");
const utils_1 = require("../../db/models/utils");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const cacheService_1 = require("../utils/cacheService");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatSubscriberRecord(s, plan) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const activatedAt = s.activatedAt ? new Date(s.activatedAt) : null;
    const expiresAt = activatedAt && (plan === null || plan === void 0 ? void 0 : plan.duration)
        ? new Date(activatedAt.getTime() + helpers_1.default.getDurationMs(plan.duration))
        : null;
    const daysRemaining = expiresAt
        ? Math.ceil((expiresAt.getTime() - Date.now()) / 86400000)
        : null;
    return {
        id: String(s._id),
        user: {
            username: (_b = (_a = s.user) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : "—",
            email: (_d = (_c = s.user) === null || _c === void 0 ? void 0 : _c.email) !== null && _d !== void 0 ? _d : "—",
            dp: (_f = (_e = s.user) === null || _e === void 0 ? void 0 : _e.dp) !== null && _f !== void 0 ? _f : "",
        },
        plan: (_g = plan === null || plan === void 0 ? void 0 : plan.name) !== null && _g !== void 0 ? _g : "—",
        autorenew: (_h = plan === null || plan === void 0 ? void 0 : plan.autorenew) !== null && _h !== void 0 ? _h : false,
        activatedAt,
        expiresAt,
        daysRemaining,
    };
}
class AdminSubscriptionsService {
    assertAdmin(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            if (!user || user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Forbidden", CustomError_1.ErrorCodes.FORBIDDEN);
            }
        });
    }
    getStats(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(token);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mongoose model registered without typed schema
            const Sub = models_1.Subscriber;
            const [active, grouped, recent] = yield Promise.all([
                models_1.Subscriber.countDocuments({ active: true }),
                Sub.aggregate([
                    { $match: { active: true } },
                    { $group: { _id: "$parent", count: { $sum: 1 } } },
                ]),
                Sub.find({ active: true, activatedAt: { $ne: null } })
                    .sort({ activatedAt: -1 })
                    .limit(20)
                    .populate({ path: "user", select: "username email dp", model: "users" })
                    .populate({ path: "parent", select: "name duration autorenew", model: "subscription" }),
            ]);
            const planIds = grouped.map((g) => g._id);
            const plans = yield models_1.Subscription.find({ _id: { $in: planIds } }, "name amount duration");
            const byPlan = grouped.map((g) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped Mongoose document fields
                const plan = plans.find((p) => { var _a; return p._id.toString() === ((_a = g._id) === null || _a === void 0 ? void 0 : _a.toString()); });
                return {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name: plan ? plan.name : "Unknown",
                    count: g.count,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    amount: plan ? plan.amount : 0,
                };
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- populated Mongoose docs are untyped
            const recentFormatted = recent.map((s) => formatSubscriberRecord(s, s.parent));
            return { active, byPlan, recent: recentFormatted };
        });
    }
    list(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(token);
            const subscriptions = yield models_1.Subscription.find({}).select("-__v").lean();
            return subscriptions;
        });
    }
    create(token, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(token);
            if (!data.name) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Subscription name is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            if (data.amount === undefined || data.amount === null) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Subscription amount is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            // Only validate duration if it's provided, otherwise let the model use its default
            if (data.duration !== undefined && data.duration !== null && Number(data.duration) < 1) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Invalid subscription duration", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            data.origin = ""; // Prevent setting the origin field
            const subscription = yield models_1.Subscription.create(data);
            yield this.clearCache();
            return subscription;
        });
    }
    update(token, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(token);
            if (!id) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Subscription ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            data.origin = ""; // Prevent changing the origin field
            const subscription = yield models_1.Subscription.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
            if (!subscription) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Subscription not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            yield this.clearCache();
            return subscription;
        });
    }
    delete(token, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(token);
            if (!id) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Subscription ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            // Guard: refuse if any subscribers are still active on this plan
            const activeCount = yield models_1.Subscriber.countDocuments({ parent: id, active: true });
            if (activeCount > 0) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], `Cannot delete: ${activeCount} active subscriber(s) on this plan`, CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const subscription = yield models_1.Subscription.findByIdAndDelete(id).lean();
            if (!subscription) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Subscription not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            yield this.clearCache();
            return subscription;
        });
    }
    clearCache() {
        return __awaiter(this, void 0, void 0, function* () {
            yield cacheService_1.CacheService.clearPattern("subscriptions:*");
        });
    }
}
exports.default = new AdminSubscriptionsService();
