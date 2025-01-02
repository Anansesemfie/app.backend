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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class SeenRepository {
    create(seen) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Seen.create(seen);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetch(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seens = yield models_1.Seen.find({ bookId: bookId });
                return seens;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchOne(bookId_1) {
        return __awaiter(this, arguments, void 0, function* (bookId, userId = "") {
            try {
                const seen = yield models_1.Seen.findOne({ bookId: bookId, user: userId });
                return seen;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAll(bookID, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seen = yield models_1.Seen.find(Object.assign({ bookID }, params));
                return seen;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(params, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSeen = yield models_1.Seen.findOneAndUpdate(params, payload);
                return updatedSeen;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new SeenRepository();
