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
const quoteRepository_1 = __importDefault(require("../../db/repository/quoteRepository"));
const sessionService_1 = __importDefault(require("../sessionService"));
const utils_1 = require("../../db/models/utils");
const CustomError_1 = __importStar(require("../../utils/CustomError"));
const error_1 = require("../../utils/error");
class QuoteAdminService {
    CreateQuote(quote, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            this.checkForAdmin(user);
            return yield quoteRepository_1.default.create(quote);
        });
    }
    UpdateQuote(id, quote, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            this.checkForAdmin(user);
            if (!id) {
                throw new CustomError_1.default(error_1.ErrorEnum[401], "Quote ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            return yield quoteRepository_1.default.update(id, quote);
        });
    }
    DeleteQuote(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            this.checkForAdmin(user);
            if (!id) {
                throw new CustomError_1.default(error_1.ErrorEnum[401], "Quote ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            yield quoteRepository_1.default.delete(id);
            return "Quote deleted successfully";
        });
    }
    FetchAllQuotes(token_1) {
        return __awaiter(this, arguments, void 0, function* (token, limit = 10, page = 1) {
            const { user } = yield sessionService_1.default.getSession(token);
            this.checkForAdmin(user);
            return yield quoteRepository_1.default.fetchAll(limit, page);
        });
    }
    FetchQuote(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(token);
            this.checkForAdmin(user);
            if (!id) {
                throw new CustomError_1.default(error_1.ErrorEnum[401], "Quote ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            return yield quoteRepository_1.default.fetchOne(id);
        });
    }
    checkForAdmin(user) {
        if (!user || (user === null || user === void 0 ? void 0 : user.account) !== utils_1.UsersTypes.admin)
            throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid User", CustomError_1.ErrorCodes.FORBIDDEN);
    }
    FetchActiveQuotes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield quoteRepository_1.default.fetchActiveQuotes();
        });
    }
}
exports.default = new QuoteAdminService();
