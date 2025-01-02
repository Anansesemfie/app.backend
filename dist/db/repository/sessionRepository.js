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
class SessionRepository {
    create(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Session.create(session);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchOne(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedSession = yield models_1.Session.findOne({
                    _id: sessionId,
                });
                if (!fetchedSession) {
                    throw error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid Session ID");
                }
                return fetchedSession;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(sessionId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSession = yield models_1.Session.findOneAndUpdate({ _id: sessionId }, session, {
                    new: true,
                });
                return updatedSession;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchOneByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedSession = yield models_1.Session.findOne({
                    token: token,
                    // expiredAt: { $gt: new Date() },
                });
                return fetchedSession;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new SessionRepository();
