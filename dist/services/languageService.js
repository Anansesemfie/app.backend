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
const languageRepository_1 = __importDefault(require("../db/repository/languageRepository"));
const error_1 = require("../utils/error");
const CustomError_1 = __importStar(require("../utils/CustomError"));
class LanguageService {
    createLanguage(language, sessionID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sessionID) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Invalid session ID", CustomError_1.ErrorCodes.FORBIDDEN);
            }
            const lang = yield languageRepository_1.default.create(language);
            return lang;
        });
    }
    getAllLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const langs = yield languageRepository_1.default.getAll();
                if (!langs) {
                    throw new CustomError_1.default(error_1.ErrorEnum[404], "Languages not found", CustomError_1.ErrorCodes.NOT_FOUND);
                }
                return Promise.all(langs.map((lang) => this.formatLanguage(lang)));
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[500], (_a = error.message) !== null && _a !== void 0 ? _a : "Failed to get languages", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getLanguageById(language) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const lang = yield languageRepository_1.default.getById(language);
                if (!lang) {
                    throw new CustomError_1.default(error_1.ErrorEnum[404], "Language not found", CustomError_1.ErrorCodes.NOT_FOUND);
                }
                return lang._id;
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[500], (_a = error.message) !== null && _a !== void 0 ? _a : "Failed to get language", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
    formatLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: language._id,
                name: language.title,
            };
        });
    }
}
exports.default = new LanguageService();
