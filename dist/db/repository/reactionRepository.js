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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const error_1 = __importStar(require("../../utils/error"));
class ReactionRepository {
    create(reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Reaction.create(reaction);
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[401], "Error creating reaction");
            }
        });
    }
    getReaction(bookId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({ bookId, userId });
                const reaction = yield models_1.Reaction.findOne({
                    bookID: bookId,
                    user: userId,
                });
                console.log({ reaction });
                return reaction;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[401], "Error fetching reactions");
            }
        });
    }
    getReactions(bookId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reactions = yield models_1.Reaction.find(Object.assign({ bookID: bookId, deletedAt: null }, params));
                return reactions;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error fetching reactions");
            }
        });
    }
    getAllReactions(bookID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reactions = yield models_1.Reaction.find({ bookID: bookID });
                return reactions;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error fetching reactions");
            }
        });
    }
    deleteReactions(reactionID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield models_1.Reaction.findByIdAndDelete(reactionID);
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error deleting reaction");
            }
        });
    }
    updateReaction(reactionID, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedReaction = yield models_1.Reaction.findByIdAndUpdate(reactionID, reaction, { new: true });
                return updatedReaction;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error updating reaction");
            }
        });
    }
}
exports.default = new ReactionRepository();
