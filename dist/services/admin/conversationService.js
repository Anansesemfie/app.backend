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
class ConversationService {
    assertAdmin(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            if (!user || user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Forbidden", CustomError_1.ErrorCodes.FORBIDDEN);
            }
        });
    }
    getComments(token_1, _a) {
        return __awaiter(this, arguments, void 0, function* (token, { page = 1, limit = 20, bookId }) {
            yield this.assertAdmin(token);
            const filter = { deletedAt: { $exists: false } };
            if (bookId)
                filter.bookID = bookId;
            const skip = (page - 1) * limit;
            const [results, total] = yield Promise.all([
                models_1.Comment
                    .find(filter)
                    .populate("bookID", "title")
                    .populate("user", "username dp")
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),
                models_1.Comment.countDocuments(filter),
            ]);
            const formatted = results.map((c) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return ({
                    id: c._id,
                    comment: c.comment,
                    createdAt: c.createdAt,
                    book: { id: (_a = c.bookID) === null || _a === void 0 ? void 0 : _a._id, title: (_c = (_b = c.bookID) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : "—" },
                    user: { id: (_d = c.user) === null || _d === void 0 ? void 0 : _d._id, username: (_f = (_e = c.user) === null || _e === void 0 ? void 0 : _e.username) !== null && _f !== void 0 ? _f : "—", dp: (_h = (_g = c.user) === null || _g === void 0 ? void 0 : _g.dp) !== null && _h !== void 0 ? _h : "" },
                });
            });
            return { results: formatted, total, page };
        });
    }
    deleteComment(token, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(token);
            yield models_1.Comment.findOneAndUpdate({ _id: id }, { deletedAt: new Date() });
            return "comment deleted";
        });
    }
}
exports.default = new ConversationService();
