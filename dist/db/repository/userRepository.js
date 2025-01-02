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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const error_1 = __importStar(require("../../utils/error"));
class UserRepository {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.User.create(user);
            }
            catch (error) {
                switch (error === null || error === void 0 ? void 0 : error.code) {
                    case 11000:
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[401], "Email already exists");
                    case 11001:
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[401], "Username already exists");
                    default:
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error creating user");
                }
            }
        });
    }
    Login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedUser = yield models_1.User.findOne({ email: email });
                if (!fetchedUser) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid user credentials");
                }
                return fetchedUser;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error getting user");
            }
        });
    }
    update(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield models_1.User.findOneAndUpdate({ _id: userId }, payload, {
                    new: true,
                });
                return updatedUser;
            }
            catch (error) {
                switch (error === null || error === void 0 ? void 0 : error.code) {
                    case 11000:
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[401], "Email already exists");
                    case 11001:
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[401], "Username already exists");
                    default:
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error updating user");
                }
            }
        });
    }
    fetchUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedUser = yield models_1.User.findOne({ _id: userId });
                return fetchedUser;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error fetching user");
            }
        });
    }
    fetchOneByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.User.findOne({ email });
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Error fetching user");
            }
        });
    }
}
exports.default = new UserRepository();
