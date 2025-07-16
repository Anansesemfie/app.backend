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
const reactionRepository_1 = __importDefault(require("../db/repository/reactionRepository"));
const sessionService_1 = __importDefault(require("./sessionService"));
const periodService_1 = __importDefault(require("./periodService"));
const error_1 = require("../utils/error");
const CustomError_1 = __importStar(require("../utils/CustomError"));
class ReactionService {
    constructor() {
        this.logInfo = "";
    }
    createReaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sessionID, bookID, action, }) {
            var _b;
            if (!sessionID || !bookID || !action) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid session ID, book ID or action", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const { session } = yield sessionService_1.default.getSession(sessionID);
            const period = yield periodService_1.default.fetchLatest();
            const newReaction = yield reactionRepository_1.default.create({
                bookID,
                user: session === null || session === void 0 ? void 0 : session.user,
                action: action,
                period: (_b = period._id) !== null && _b !== void 0 ? _b : "",
            });
            return newReaction;
        });
    }
    updateReaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ reaction, action, }) {
            if (!reaction || !action) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book ID or action", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            if (action == reaction.action) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Can not take same action twice", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const react = {
                bookID: reaction.bookID,
                user: reaction.user,
                action,
            };
            const updatedReaction = yield reactionRepository_1.default.updateReaction(reaction === null || reaction === void 0 ? void 0 : reaction._id, react);
            return updatedReaction;
        });
    }
    getReactions(bookID, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookID) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book ID", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const reactions = yield reactionRepository_1.default.getReactions(bookID, params);
            return reactions;
        });
    }
}
exports.default = new ReactionService();
