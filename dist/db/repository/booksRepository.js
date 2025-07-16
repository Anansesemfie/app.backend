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
const models_1 = require("../models");
const error_1 = require("../../utils/error");
const utils_1 = require("../models/utils");
const CustomError_1 = __importStar(require("../../utils/CustomError"));
const helpers_1 = __importDefault(require("../../utils/helpers"));
class BookRepository {
    create(book) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield models_1.Book.create(book);
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error creating book", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    fetchOne(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const fetchedBook = yield models_1.Book.findOne({
                    _id: bookId,
                });
                return fetchedBook;
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error fetching book", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    update(bookId, book) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const updatedBook = yield models_1.Book.findOneAndUpdate({ _id: bookId }, book, {
                    new: true,
                });
                return updatedBook;
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error updating book", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    delete(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                helpers_1.default.LOG('delete', { bookId });
                yield models_1.Book.findByIdAndDelete(bookId);
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[500], (_a = error.message) !== null && _a !== void 0 ? _a : "Error deleting book", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    fetchAll() {
        return __awaiter(this, arguments, void 0, function* (numberOfRecords = 5, page = 0, params = { status: utils_1.BookStatus.Active }) {
            var _a;
            try {
                const sanitizedParams = this.sanitizeRegex(params);
                const fetchedBooks = yield models_1.Book.find(Object.assign({}, sanitizedParams))
                    .skip(numberOfRecords * (page - 1))
                    .limit(numberOfRecords)
                    .sort({ createdAt: -1 });
                return fetchedBooks;
            }
            catch (error) {
                helpers_1.default.LOG("Error fetching books:", { error });
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error fetching books", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    sanitizeRegex(obj) {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.sanitizeRegex(item));
        }
        else if (obj && typeof obj === "object") {
            const sanitized = {};
            for (const key in obj) {
                if (key === "$regex" && typeof obj[key] !== "string") {
                    // Skip invalid $regex
                    continue;
                }
                sanitized[key] = this.sanitizeRegex(obj[key]);
            }
            // Remove keys that became empty objects
            for (const key in sanitized) {
                if (sanitized[key] &&
                    typeof sanitized[key] === "object" &&
                    !Array.isArray(sanitized[key]) &&
                    Object.keys(sanitized[key]).length === 0) {
                    delete sanitized[key];
                }
            }
            return sanitized;
        }
        return obj;
    }
}
exports.default = new BookRepository();
