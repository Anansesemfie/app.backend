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
exports.Play = void 0;
const playService_1 = __importDefault(require("../services/playService"));
const Play = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapterId = req.params.chapter;
        const userId = res.locals.sessionId;
        let chapter = null;
        if (userId) {
            chapter = yield playService_1.default.authorizedUserPlay(chapterId, userId);
        }
        else {
            chapter = yield playService_1.default.unAuthorizedUserPlay(chapterId, userId);
        }
        res.status(200).json({ data: chapter });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.Play = Play;
