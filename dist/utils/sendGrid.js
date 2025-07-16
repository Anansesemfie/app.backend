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
const mail_1 = __importDefault(require("@sendgrid/mail"));
const env_1 = require("../utils/env");
const CustomError_1 = __importStar(require("../utils/CustomError"));
class SENDGRID {
    constructor() {
        this.sgEmail = mail_1.default;
        this.defaultOptions = {
            from: env_1.EMAIL_OPERAND,
            subject: "From Anansesemfie",
        };
        this.logInfo = "";
    }
    init() {
        this.sgEmail.setApiKey(env_1.SENDGRID_KEY);
    }
    /**
     * Send an email with the specified parameters.
     *
     * @param {string} to - The recipient's email address
     * @param {string} subject - The subject of the email
     * @param {string} text - The plain text version of the email content
     * @param {string} html - The HTML version of the email content
     * @returns {Promise<void>} - The response from the email service
     */
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = Object.assign(Object.assign({}, this.defaultOptions), options);
            const response = yield this.sgEmail.send(email);
            if (!response) {
                throw new CustomError_1.default('Internal Server Error', "Failed to send email", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
            }
            return true;
        });
    }
}
exports.default = SENDGRID;
