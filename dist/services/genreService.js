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
const genreRepository_1 = __importDefault(require("../db/repository/genreRepository"));
const booksRepository_1 = __importDefault(require("../db/repository/booksRepository"));
const sessionService_1 = __importDefault(require("./sessionService"));
const error_1 = require("../utils/error");
const utils_1 = require("../db/models/utils");
const CustomError_1 = __importStar(require("../utils/CustomError"));
const cacheService_1 = require("./utils/cacheService");
class GenreService {
    createGenre(data, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(session);
            if (user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "You are not authorized to create a genre", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const genre = yield genreRepository_1.default.create(data);
            yield cacheService_1.CacheService.clearPattern("genres:*");
            return this.formatGenre(genre);
        });
    }
    updateGenre(id, data, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(session);
            if (user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "You are not authorized to update a genre", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const genre = yield genreRepository_1.default.updateById(id, data);
            if (!genre) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Genre not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            yield cacheService_1.CacheService.clearPattern("genres:*");
            return this.formatGenre(genre);
        });
    }
    deleteGenre(id, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(session);
            if (user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "You are not authorized to delete a genre", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const books = yield booksRepository_1.default.fetchAll(1, 1, { genres: { $in: [id] } });
            if (books.length > 0) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Cannot delete genre: it is associated with one or more books", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            yield genreRepository_1.default.deleteById(id);
            yield cacheService_1.CacheService.clearPattern("genres:*");
        });
    }
    fetchGenre(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `genres:one:id:${id}`;
            const cached = yield cacheService_1.CacheService.get(cacheKey);
            if (cached)
                return cached;
            const genre = yield genreRepository_1.default.getById(id);
            if (!genre) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Genre not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            const result = this.formatGenre(genre);
            yield cacheService_1.CacheService.set(cacheKey, result, 3600);
            return result;
        });
    }
    fetchAllGenres() {
        return __awaiter(this, arguments, void 0, function* ({ limit = 10, page = 1, search = "", sort = { title: 1 }, } = {}) {
            const cacheKey = `genres:list:l:${limit}:p:${page}:s:${search}:sort:${JSON.stringify(sort)}`;
            const cached = yield cacheService_1.CacheService.get(cacheKey);
            if (cached)
                return cached;
            const { genres, total } = yield genreRepository_1.default.getAll(limit, page, { search, sort });
            const formattedGenres = genres.map((genre) => this.formatGenre(genre));
            const result = { genres: formattedGenres, total, page, limit };
            yield cacheService_1.CacheService.set(cacheKey, result, 3600);
            return result;
        });
    }
    toggleGenreActive(id, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(session);
            if (user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "You are not authorized to toggle a genre", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const genre = yield genreRepository_1.default.getById(id);
            if (!genre) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Genre not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            const updated = yield genreRepository_1.default.updateById(id, { active: !genre.active });
            yield cacheService_1.CacheService.clearPattern("genres:*");
            return this.formatGenre(updated);
        });
    }
    formatGenre(genre) {
        var _a, _b;
        return {
            id: ((_a = genre._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            name: genre.title,
            active: (_b = genre.active) !== null && _b !== void 0 ? _b : true,
        };
    }
}
exports.default = new GenreService();
