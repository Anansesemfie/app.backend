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
const helpers_1 = __importDefault(require("../utils/helpers"));
const seenRepository_1 = __importDefault(require("../db/repository/seenRepository"));
class SeenService {
    constructor() {
        this.logInfo = "";
    }
    createNewSeen(bookId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldSeen = yield seenRepository_1.default.fetchOne(bookId, userId);
                if (oldSeen)
                    return oldSeen;
                const newSeen = {
                    user: userId,
                    bookID: bookId,
                };
                const seen = yield seenRepository_1.default.create(newSeen);
                this.logInfo = `${helpers_1.default.loggerInfo.success} creating new seen @ ${helpers_1.default.currentTime()}`;
                return seen;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching books @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    updateSeen(bookId, userId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSeen = yield seenRepository_1.default.update({
                    bookID: bookId,
                    user: userId,
                }, payload);
                this.logInfo = `${helpers_1.default.loggerInfo.success} updating seen @ ${helpers_1.default.currentTime()}`;
                return updatedSeen;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} updating seen @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    getSeensAndPlay(bookId, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seen = yield seenRepository_1.default.findAll(bookId, {
                    seenAt: { $gte: new Date(start), $lt: new Date(end) },
                });
                const played = yield seenRepository_1.default.findAll(bookId, {
                    playedAt: { $gte: new Date(start), $lt: new Date(end) },
                });
                return { seen: seen.length, played: played.length };
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching seen and played @ ${helpers_1.default.currentTime()}`;
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
                return { seen: 0, played: 0 };
            }
        });
    }
}
exports.default = new SeenService();
