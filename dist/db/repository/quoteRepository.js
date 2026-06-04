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
const error_1 = require("../../utils/error");
const CustomError_1 = __importStar(require("../../utils/CustomError"));
class QuoteRepository {
    create(quote) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield models_1.Quote.create(quote);
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.name === "CastError" || error.name === "ValidationError")) {
                    throw error;
                }
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error creating quote", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    fetchOne(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const fetchedQuote = yield models_1.Quote.findById(quoteId);
                return fetchedQuote;
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.name === "CastError" || error.name === "ValidationError")) {
                    throw error;
                }
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error fetching quote", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    update(quoteId, quote) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const updatedQuote = yield models_1.Quote.findByIdAndUpdate(quoteId, quote, {
                    new: true,
                });
                return updatedQuote;
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.name === "CastError" || error.name === "ValidationError")) {
                    throw error;
                }
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error updating quote", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    delete(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield models_1.Quote.findByIdAndDelete(quoteId);
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.name === "CastError" || error.name === "ValidationError")) {
                    throw error;
                }
                throw new CustomError_1.default(error_1.ErrorEnum[500], (_a = error.message) !== null && _a !== void 0 ? _a : "Error deleting quote", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
    fetchAll() {
        return __awaiter(this, arguments, void 0, function* (numberOfRecords = 10, page = 1, params = {}) {
            var _a;
            try {
                const fetchedQuotes = yield models_1.Quote.find(params)
                    .skip(numberOfRecords * (page - 1))
                    .limit(numberOfRecords)
                    .sort({ createdAt: -1 });
                return fetchedQuotes;
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.name === "CastError" || error.name === "ValidationError")) {
                    throw error;
                }
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error fetching quotes", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    fetchActiveQuotes() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const activeQuote = yield models_1.Quote.find({ active: true }).sort({
                    createdAt: -1,
                });
                return activeQuote;
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.name === "CastError" || error.name === "ValidationError")) {
                    throw error;
                }
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error fetching active quote", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
}
exports.default = new QuoteRepository();
