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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentRepository_1 = __importDefault(require("../db/repository/commentRepository"));
const booksService_1 = __importDefault(require("./booksService"));
const periodService_1 = __importDefault(require("./periodService"));
const sessionService_1 = __importDefault(require("./sessionService"));
const userService_1 = __importDefault(require("./userService"));
const CustomError_1 = __importStar(require("../utils/CustomError"));
const error_1 = require("../utils/error");
const helpers_1 = __importDefault(require("../utils/helpers"));
const utils_1 = require("../db/models/utils");
class CommentService {
    createComment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ bookID, sessionID, comment, parentId = null, }) {
            if (helpers_1.default.hasSpecialCharacters(comment)) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Comment contains special characters", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            if (!bookID || !sessionID || !comment) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book, user or comment", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            if (parentId) {
                const parent = yield commentRepository_1.default.findById(parentId);
                if (!parent) {
                    throw new CustomError_1.default(error_1.ErrorEnum[404], "Parent comment not found", CustomError_1.ErrorCodes.NOT_FOUND);
                }
                if (parent.parentId) {
                    throw new CustomError_1.default(error_1.ErrorEnum[403], "Replies cannot be nested more than one level deep", CustomError_1.ErrorCodes.FORBIDDEN);
                }
            }
            const { session } = yield sessionService_1.default.getSession(sessionID);
            const period = yield periodService_1.default.fetchLatest();
            if (!period) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "No active period found. Cannot create comment.", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            const newComment = yield commentRepository_1.default.create({
                bookID,
                user: session === null || session === void 0 ? void 0 : session.user,
                comment,
                period: period._id,
                parentId,
            });
            // Only top-level comments increment the counter
            if (!parentId) {
                yield booksService_1.default.updateBookMeta(bookID, {
                    meta: "comments",
                    action: "Plus",
                });
            }
            return newComment;
        });
    }
    getComments(bookId_1) {
        return __awaiter(this, arguments, void 0, function* (bookId, _a = {}) {
            var { page = 1, limit = 20 } = _a, filters = __rest(_a, ["page", "limit"]);
            if (!bookId) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book ID", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const skip = (page - 1) * limit;
            const [topLevel, total] = yield Promise.all([
                commentRepository_1.default.getComments(bookId, Object.assign({ skip, limit }, filters)),
                commentRepository_1.default.countComments(bookId, filters),
            ]);
            const parentIds = topLevel.map((c) => String(c._id));
            const allReplies = yield commentRepository_1.default.getReplies(parentIds);
            // Group replies by parentId string key
            const replyMap = {};
            for (const reply of allReplies) {
                const key = String(reply.parentId);
                if (!replyMap[key])
                    replyMap[key] = [];
                replyMap[key].push(reply);
            }
            const results = yield Promise.all(topLevel.map((comment) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const replyTypes = (_a = replyMap[String(comment._id)]) !== null && _a !== void 0 ? _a : [];
                const formattedReplies = (yield Promise.all(replyTypes.map((r) => this.formatComment(r)))).filter(Boolean);
                return this.formatComment(comment, formattedReplies);
            })));
            return {
                page,
                limit,
                total,
                results: results.filter(Boolean),
            };
        });
    }
    deleteComment(commentId, sessionID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!commentId || !sessionID) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid comment ID or session", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const comment = yield commentRepository_1.default.findById(commentId);
            if (!comment || comment.deletedAt) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Comment not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            const { user } = yield sessionService_1.default.getSession(sessionID);
            const isOwner = String(comment.user) === String(user === null || user === void 0 ? void 0 : user._id);
            const isAdmin = (user === null || user === void 0 ? void 0 : user.account) === utils_1.UsersTypes.admin;
            if (!isOwner && !isAdmin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "You can only delete your own comments", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const deletedAt = helpers_1.default.currentTime();
            yield commentRepository_1.default.softDelete(commentId, deletedAt);
            // Cascade soft-delete replies and decrement counter only for top-level
            if (!comment.parentId) {
                yield commentRepository_1.default.softDeleteReplies(commentId, deletedAt);
                yield booksService_1.default.updateBookMeta(comment.bookID, {
                    meta: "comments",
                    action: "Minus",
                });
            }
        });
    }
    formatComment(comment_1) {
        return __awaiter(this, arguments, void 0, function* (comment, replies = []) {
            try {
                const user = yield userService_1.default.fetchUser(comment.user);
                if (user) {
                    const formatted = {
                        id: String(comment._id),
                        user: {
                            id: String(user._id),
                            name: user.username,
                            picture: user.dp,
                            email: user.email,
                        },
                        comment: comment.comment,
                        createdAt: String(comment.createdAt),
                        replies,
                    };
                    return formatted;
                }
            }
            catch (_a) {
                // user lookup failure should not surface to the caller
            }
        });
    }
}
exports.default = new CommentService();
