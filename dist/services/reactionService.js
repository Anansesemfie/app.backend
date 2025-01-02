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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const error_1 = __importStar(require("../utils/error"));
const helpers_1 = __importDefault(require("../utils/helpers"));
class ReactionService {
    constructor() {
        this.logInfo = "";
    }
    createReaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sessionID, bookID, action, }) {
            try {
                if (!sessionID || !bookID || !action) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid user, book or action");
                }
                const { session } = yield sessionService_1.default.getSession(sessionID);
                const reactionRes = yield reactionRepository_1.default.getReaction(bookID, String(session.user));
                if (reactionRes) {
                    return this.updateReaction({ reaction: reactionRes, action });
                }
                const newReaction = yield reactionRepository_1.default.create({
                    bookID,
                    user: session === null || session === void 0 ? void 0 : session.user,
                    action: action,
                });
                this.logInfo = `${helpers_1.default.loggerInfo.success} ${session === null || session === void 0 ? void 0 : session.user} ${action} book: ${bookID} @ ${helpers_1.default.currentTime()}`;
                return newReaction;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} user with session: ${sessionID} failed to ${action} book: ${bookID} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    updateReaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ reaction, action, }) {
            try {
                if (!reaction || !action) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid book ID or action");
                }
                if (action == reaction.action) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Can not take same action twice");
                }
                const react = {
                    bookID: reaction.bookID,
                    user: reaction.user,
                    action,
                };
                const updatedReaction = yield reactionRepository_1.default.updateReaction(reaction === null || reaction === void 0 ? void 0 : reaction._id, react);
                this.logInfo = `${helpers_1.default.loggerInfo.success} ${reaction.user} ${action} book: ${reaction.bookID} @ ${helpers_1.default.currentTime()}`;
                return updatedReaction;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} user with session: ${reaction.user} failed to ${action} book: ${reaction.bookID} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    getReactions(bookID, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!bookID) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid book ID");
                }
                const reactions = yield reactionRepository_1.default.getReactions(bookID, params);
                this.logInfo = `${helpers_1.default.loggerInfo.success} fetching all reactions on book: ${bookID} @ ${helpers_1.default.currentTime()}`;
                return reactions;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching all reactions on book: ${bookID} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
}
exports.default = new ReactionService();
