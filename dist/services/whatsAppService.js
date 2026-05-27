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
const brevo_1 = __importDefault(require("../utils/brevo"));
const CustomError_1 = __importStar(require("../utils/CustomError"));
const error_1 = require("../utils/error");
const helpers_1 = __importDefault(require("../utils/helpers"));
/**
 * WhatsAppService
 *
 * Thin wrapper around the Brevo transactional WhatsApp channel.
 * Mirrors the structure of EmailService so both services are consumed
 * the same way throughout the codebase.
 *
 * Usage:
 *   // Template message (first contact or outside 24-hour window)
 *   await whatsAppService.send({
 *     contactNumbers: ["+233241234567"],
 *     templateId: 42,
 *     params: { name: "Kofi", title: "Anansi Stories" },
 *   });
 *
 *   // Free-text reply (within active 24-hour customer-service window)
 *   await whatsAppService.send({
 *     contactNumbers: ["+233241234567"],
 *     text: "Your subscription has been renewed successfully.",
 *   });
 *
 * Prerequisites:
 *   - BREVO_WHATSAPP_SENDER env var must be set to the E.164 sender number
 *     registered in the Brevo WhatsApp dashboard.
 *   - Template messages require a pre-approved Meta/Brevo template ID.
 */
class WhatsAppService {
    constructor() {
        this.brevo = new brevo_1.default();
    }
    /**
     * Send a transactional WhatsApp message.
     *
     * @throws {CustomError} when `contactNumbers` is empty, or all delivery
     *   attempts fail.
     */
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateOptions(options);
            try {
                this.brevo.init();
                const sent = yield this.brevo.sendWhatsApp(options);
                if (sent) {
                    helpers_1.default.LOG(`${helpers_1.default.loggerInfo.success} WhatsApp message sent @ ${helpers_1.default.currentTime()}`);
                    return "WhatsApp message sent successfully";
                }
                throw new CustomError_1.default(error_1.ErrorEnum[500], "Failed to send WhatsApp message via Brevo", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
            }
            catch (error) {
                if (error instanceof CustomError_1.default)
                    throw error;
                throw new CustomError_1.default(error_1.ErrorEnum[500], "An unexpected error occurred while sending WhatsApp message", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
    validateOptions(options) {
        var _a, _b;
        if (!((_a = options.contactNumbers) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new CustomError_1.default(error_1.ErrorEnum[400], "At least one recipient contact number is required", CustomError_1.ErrorCodes.BAD_REQUEST);
        }
        if ("templateId" in options && !options.templateId) {
            throw new CustomError_1.default(error_1.ErrorEnum[400], "templateId must be a valid positive integer", CustomError_1.ErrorCodes.BAD_REQUEST);
        }
        if ("text" in options && !((_b = options.text) === null || _b === void 0 ? void 0 : _b.trim())) {
            throw new CustomError_1.default(error_1.ErrorEnum[400], "WhatsApp text message body cannot be empty", CustomError_1.ErrorCodes.BAD_REQUEST);
        }
    }
}
exports.default = new WhatsAppService();
