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
const sessionRepository_1 = __importDefault(require("../db/repository/sessionRepository"));
const userService_1 = __importDefault(require("./userService"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const error_1 = __importStar(require("../utils/error"));
class SessionService {
    constructor() {
        this.logInfo = new String();
        this.options = {
            duration: 5000,
            external: false,
        };
    }
    create(userID_1) {
        return __awaiter(this, arguments, void 0, function* (userID, options = this.options) {
            try {
                const now = new Date();
                const expirationTime = new Date(now.getTime() + options.duration).toString();
                const session = {
                    user: userID,
                    external: options === null || options === void 0 ? void 0 : options.external,
                    duration: options === null || options === void 0 ? void 0 : options.duration,
                    expiredAt: expirationTime,
                };
                return yield sessionRepository_1.default.create(session);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield sessionRepository_1.default.fetchOne(sessionId);
                if (!session) {
                    throw error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid Session ID");
                }
                if (new Date(session.expiredAt) > new Date()) {
                    throw error_1.default.CustomError(error_1.ErrorEnum[403], "Session expired");
                }
                const user = yield userService_1.default.fetchUser(session.user);
                if (!user) {
                    throw error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid User");
                }
                return { session, user };
            }
            catch (error) {
                throw error;
            }
        });
    }
    endSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const end = { expiredAt: helpers_1.default.currentTime().toString() };
                const session = yield sessionRepository_1.default.update(sessionId, end);
                if (session) {
                    return "Success";
                }
                return "Error";
            }
            catch (error) {
                throw error;
            }
        });
    }
    validateResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield sessionRepository_1.default.fetchOneByToken(token);
                if (!session || new Date(session.expiredAt) < new Date()) {
                    throw new Error("Invalid or expired token");
                }
                return session.user;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new SessionService();
