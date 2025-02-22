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
const index_1 = require("../models/index");
const error_1 = __importStar(require("../../utils/error"));
class LanguageRepository {
    // Create a new language
    create(languageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newLanguage = yield index_1.Language.create(languageData);
                return newLanguage;
            }
            catch (error) {
                throw error_1.default.CustomError(error_1.ErrorEnum[400], error === null || error === void 0 ? void 0 : error.message);
            }
        });
    }
    // Get a language by ID
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = yield index_1.Language.findOne({
                    title: id,
                });
                ;
                return language;
            }
            catch (error) {
                throw error_1.default.CustomError(error_1.ErrorEnum[400], error === null || error === void 0 ? void 0 : error.message);
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const languages = yield index_1.Language.find();
                return languages;
            }
            catch (error) {
                throw error_1.default.CustomError(error_1.ErrorEnum[400], error === null || error === void 0 ? void 0 : error.message);
            }
        });
    }
    // Update a language by ID
    updateById(id, languageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedLanguage = yield index_1.Language.findByIdAndUpdate(id, languageData, { new: true });
                return updatedLanguage;
            }
            catch (error) {
                throw error_1.default.CustomError(error_1.ErrorEnum[400], error === null || error === void 0 ? void 0 : error.message);
            }
        });
    }
    // Delete a language by ID
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield index_1.Language.findByIdAndDelete(id);
            }
            catch (error) {
                throw error_1.default.CustomError(error_1.ErrorEnum[400], error === null || error === void 0 ? void 0 : error.message);
            }
        });
    }
}
exports.default = new LanguageRepository();
