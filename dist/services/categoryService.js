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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const categoryRepository_1 = __importDefault(require("../db/repository/categoryRepository"));
const error_1 = __importStar(require("../utils/error"));
class CategoryService {
    fetchCategory(term) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryRepository_1.default.getById(term);
                if (!categories)
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[404], "Category not found");
                return yield this.formatCategory(categories);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryRepository_1.default.getAll();
                if (!categories)
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[404], "Category not found");
                return Promise.all(categories.map((category) => this.formatCategory(category)));
            }
            catch (error) {
                throw error;
            }
        });
    }
    formatCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: category._id,
                name: category.title,
            };
        });
    }
}
exports.default = new CategoryService();
