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
const helpers_1 = __importDefault(require("../utils/helpers"));
const error_1 = __importStar(require("../utils/error"));
const env_1 = require("./env");
class Paystack {
    constructor() {
        this.publicKey = env_1.PAYSTACK_PUBLIC_KEY;
        this.secretKey = env_1.PAYSTACK_SECRET_KEY;
        this.logInfo = null;
        this.serviceName = "Paystack";
        if (!this.publicKey || !this.secretKey) {
            throw new Error("Paystack keys not found");
        }
    }
    initializeTransaction(amount_1, email_1, metadata_1) {
        return __awaiter(this, arguments, void 0, function* (amount, email, metadata, callback_url = null) {
            try {
                if (!amount || !email) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "missing required fields for transaction initialization");
                }
                const response = yield fetch("https://api.paystack.co/transaction/initialize", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.secretKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: amount * 100,
                        email,
                        metadata,
                        callback_url,
                    }),
                });
                const data = yield response.json();
                if (!data.status) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], data.message);
                }
                this.logInfo = `${helpers_1.default.loggerInfo.success} initializing transaction @ ${helpers_1.default.currentTime()}`;
                if (!data.status) {
                    throw new Error(data.message);
                }
                return data;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} initializing transaction @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo, this.serviceName);
                this.logInfo = null;
            }
        });
    }
    verifyTransaction(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!reference) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "missing required fields for transaction verification");
                }
                const response = yield fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${this.secretKey}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = yield response.json();
                if (!data.status) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], data.message);
                }
                this.logInfo = `${helpers_1.default.loggerInfo.success} verifying transaction @ ${helpers_1.default.currentTime()}`;
                if (!data.status) {
                    throw new Error(data.message);
                }
                return data;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} verifying transaction @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo, this.serviceName);
                this.logInfo = null;
            }
        });
    }
}
exports.default = new Paystack();
