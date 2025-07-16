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
const helpers_1 = __importDefault(require("../utils/helpers"));
const seenRepository_1 = __importDefault(require("../db/repository/seenRepository"));
const periodService_1 = __importDefault(require("./periodService"));
const CustomError_1 = __importStar(require("../utils/CustomError"));
const error_1 = require("../utils/error");
class SeenService {
    constructor() {
        this.logInfo = "";
    }
    createNewSeen(bookId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!bookId || !userId) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Book ID and User ID are required to create a seen.", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const period = yield periodService_1.default.fetchLatest();
            if (!period) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "No active period found.", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            const oldSeen = yield this.fetchSeen(userId, bookId, (_a = period._id) !== null && _a !== void 0 ? _a : "");
            const newSeen = {
                user: userId,
                bookID: bookId,
                period: (_b = period._id) !== null && _b !== void 0 ? _b : "",
            };
            if (oldSeen) {
                return this.updateSeen((_c = oldSeen._id) !== null && _c !== void 0 ? _c : "", newSeen);
            }
            const seen = yield seenRepository_1.default.create(newSeen);
            return seen;
        });
    }
    updateSeen(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Book ID and User ID are required to update a seen.", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const updatedSeen = yield seenRepository_1.default.update(id, payload);
            return updatedSeen;
        });
    }
    fetchSeen(id, book, period) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !period) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Missing required details.", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const seen = yield seenRepository_1.default.fetchOne(book, id, period);
            return seen;
        });
    }
    recordPlay(bookId, userId, playedAt, subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!bookId || !userId) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Book ID and User ID are required to record play.", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const period = yield periodService_1.default.fetchLatest();
            let seen = yield seenRepository_1.default.fetchOne(bookId, userId, (_a = period === null || period === void 0 ? void 0 : period._id) !== null && _a !== void 0 ? _a : "");
            if (!seen) {
                seen = yield this.createNewSeen(bookId, userId);
            }
            (_b = seen.playedAt) === null || _b === void 0 ? void 0 : _b.push(playedAt || helpers_1.default.currentTime());
            const newSeen = yield this.updateSeen((_c = seen._id) !== null && _c !== void 0 ? _c : "", {
                playedAt: seen.playedAt,
                subscription,
            });
            return;
        });
    }
    getSeensAndPlay(bookId_1) {
        return __awaiter(this, arguments, void 0, function* (bookId, periodId = "") {
            if (!bookId) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Book ID is required to fetch seen and played counts.", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const data = yield seenRepository_1.default.findAll(bookId, {
                period: periodId,
            });
            helpers_1.default.LOG((data.filter((item) => { var _a; return Number((_a = item.playedAt) === null || _a === void 0 ? void 0 : _a.length) > 0; })).length);
            const seen = data.filter((item) => item.seenAt);
            const played = data.filter((item) => { var _a; return Number((_a = item.playedAt) === null || _a === void 0 ? void 0 : _a.length) > 0; });
            return { seen: seen.length, played: played.length };
        });
    }
}
exports.default = new SeenService();
