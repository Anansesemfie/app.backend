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
const narratorRepository_1 = __importDefault(require("../db/repository/narratorRepository"));
const booksRepository_1 = __importDefault(require("../db/repository/booksRepository"));
const sessionService_1 = __importDefault(require("./sessionService"));
const error_1 = require("../utils/error");
const utils_1 = require("../db/models/utils");
const CustomError_1 = __importStar(require("../utils/CustomError"));
const richText_1 = require("../utils/richText");
class NarratorService {
    createNarrator(data, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(session);
            if (user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "You are not authorized to create a narrator", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            if (data.bio)
                data.bio = (0, richText_1.sanitizeHtml)(data.bio);
            const narrator = yield narratorRepository_1.default.create(data);
            return this.formatNarrator(narrator);
        });
    }
    updateNarrator(id, data, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(session);
            if (user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "You are not authorized to update a narrator", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            if (data.bio)
                data.bio = (0, richText_1.sanitizeHtml)(data.bio);
            const narrator = yield narratorRepository_1.default.updateById(id, data);
            if (!narrator) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Narrator not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            return this.formatNarrator(narrator);
        });
    }
    deleteNarrator(id, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield sessionService_1.default.getSession(session);
            if (user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "You are not authorized to delete a narrator", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const books = yield booksRepository_1.default.fetchAll(1, 1, { narrators: { $in: [id] } });
            if (books.length > 0) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Cannot delete narrator: they are associated with one or more books", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            yield narratorRepository_1.default.deleteById(id);
        });
    }
    fetchNarrator(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const narrator = yield narratorRepository_1.default.getById(id);
            if (!narrator) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "Narrator not found", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            return this.formatNarrator(narrator);
        });
    }
    fetchAllNarrators() {
        return __awaiter(this, arguments, void 0, function* ({ limit = 10, page = 1, search = "", } = {}) {
            const { narrators, total } = yield narratorRepository_1.default.getAll(limit, page, { search });
            const formattedNarrators = yield Promise.all(narrators.map((narrator) => this.formatNarrator(narrator)));
            return { narrators: formattedNarrators, total, page, limit };
        });
    }
    formatNarrator(narrator) {
        var _a, _b;
        return {
            id: ((_a = narrator._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            name: narrator.name,
            bio: narrator.bio,
            active: (_b = narrator.active) !== null && _b !== void 0 ? _b : true,
        };
    }
}
exports.default = new NarratorService();
