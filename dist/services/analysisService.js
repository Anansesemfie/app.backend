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
const commentService_1 = __importDefault(require("./commentService"));
const seenService_1 = __importDefault(require("./seenService"));
const reactionService_1 = __importDefault(require("./reactionService"));
const periodService_1 = __importDefault(require("./periodService"));
const CustomError_1 = __importStar(require("../utils/CustomError"));
class Analysis {
    analyzeBook(bookId_1) {
        return __awaiter(this, arguments, void 0, function* (bookId, period = "") {
            if (!bookId) {
                throw new CustomError_1.default("Invalid book ID", "Invalid book ID", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            if (!period) {
                const latestPeriod = yield periodService_1.default.fetchLatest();
                if (!latestPeriod) {
                    throw new CustomError_1.default("No period found", "No period found", CustomError_1.ErrorCodes.NOT_FOUND);
                }
                period = latestPeriod._id;
            }
            const [{ seen, played }, comments, likes, dislikes] = yield Promise.all([
                seenService_1.default.getSeensAndPlay(bookId, period),
                commentService_1.default.getComments(bookId, { period }),
                reactionService_1.default.getReactions(bookId, { period, action: "like" }),
                reactionService_1.default.getReactions(bookId, { period, action: "dislike" }),
            ]);
            return [
                { label: "Seen", data: seen },
                { label: "Played", data: played },
                { label: "Comments", data: comments.length },
                { label: "Likes", data: likes.length },
                { label: "Dislikes", data: dislikes.length },
            ];
        });
    }
}
exports.default = new Analysis();
