"use strict";
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
class Analysis {
    analyzeBook(from, to, bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { seen, played } = yield seenService_1.default.getSeensAndPlay(bookId, from, to);
                const comments = yield commentService_1.default.getComments(bookId, {
                    createdAt: { $gte: new Date(from), $lt: new Date(to) },
                });
                const likes = yield reactionService_1.default.getReactions(bookId, {
                    createdAt: { $gte: new Date(from), $lt: new Date(to) },
                    action: "like",
                });
                const dislikes = yield reactionService_1.default.getReactions(bookId, {
                    createdAt: { $gte: new Date(from), $lt: new Date(to) },
                    action: "dislike",
                });
                return [
                    { label: "Seen", data: seen },
                    { label: "Played", data: played },
                    { label: "Comments", data: comments.length },
                    { label: "Likes", data: likes.length },
                    { label: "Dislikes", data: dislikes.length },
                ];
            }
            catch (error) { }
        });
    }
}
exports.default = new Analysis();
