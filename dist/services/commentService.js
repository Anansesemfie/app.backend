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
const commentRepository_1 = __importDefault(require("../db/repository/commentRepository"));
const sessionService_1 = __importDefault(require("./sessionService"));
const booksService_1 = __importDefault(require("./booksService"));
const userService_1 = __importDefault(require("./userService"));
const periodService_1 = __importDefault(require("./periodService"));
const error_1 = require("../utils/error");
const helpers_1 = __importDefault(require("../utils/helpers"));
const CustomError_1 = __importStar(require("../utils/CustomError"));
class CommentService {
    constructor() {
        this.logInfo = "";
    }
    createComment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ bookID, sessionID, comment, }) {
            var _b;
            if (helpers_1.default.hasSpecialCharacters(comment)) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Comment contains special characters", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            if (!bookID || !sessionID || !comment) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book, user or comment", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const { session } = yield sessionService_1.default.getSession(sessionID);
            const period = yield periodService_1.default.fetchLatest();
            const newComment = yield commentRepository_1.default.create({
                bookID,
                user: session === null || session === void 0 ? void 0 : session.user,
                comment,
                period: (_b = period._id) !== null && _b !== void 0 ? _b : "",
            });
            yield booksService_1.default.updateBookMeta(bookID, {
                meta: "comments",
                action: "Plus",
            });
            return newComment;
        });
    }
    getComments(bookId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookId) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid book ID", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const comments = yield commentRepository_1.default.getComments(bookId, params);
            return yield Promise.all(comments.map((comment) => this.formatComment(comment)));
        });
    }
    formatComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userService_1.default.fetchUser(comment.user);
                if (user) {
                    const formatted = {
                        id: comment._id,
                        user: {
                            id: user._id,
                            name: user.username,
                            picture: user.dp,
                            email: user.email,
                        },
                        comment: comment.comment,
                    };
                    return formatted;
                }
            }
            catch (error) { }
        });
    }
}
exports.default = new CommentService();
