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
const brevo_1 = require("@getbrevo/brevo");
const CustomError_1 = __importStar(require("./CustomError"));
const env_1 = require("./env");
class BREVO {
    constructor() {
        this.client = null;
        this.defaultEmailOptions = {
            from: env_1.EMAIL_OPERAND,
            subject: "From Anansesemfie",
        };
    }
    init() {
        if (this.client)
            return; // already initialised — don't recreate on every send
        this.client = new brevo_1.BrevoClient({
            apiKey: env_1.BREVO_KEY,
        });
    }
    // ─── Email ─────────────────────────────────────────────────────────────────
    /**
     * Send a transactional email using Brevo.
     *
     * @param {EmailOptions} options - The email parameters
     * @returns {Promise<boolean>} - True if successful
     */
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new Error("Brevo service is not initialized. Call init() first.");
            }
            const email = Object.assign(Object.assign({}, this.defaultEmailOptions), options);
            try {
                const response = yield this.client.transactionalEmails.sendTransacEmail({
                    subject: email.subject,
                    htmlContent: email.html,
                    sender: {
                        email: email.from || env_1.EMAIL_OPERAND,
                        name: "Anansesemfie",
                    },
                    to: [{ email: email.to }],
                });
                if (!(response === null || response === void 0 ? void 0 : response.messageId)) {
                    throw new CustomError_1.default("Internal Server Error", "Failed to send email via Brevo", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
                }
                return true;
            }
            catch (error) {
                console.error("Brevo email error:", error);
                return false;
            }
        });
    }
    // ─── WhatsApp ───────────────────────────────────────────────────────────────
    /**
     * Send a transactional WhatsApp message using Brevo.
     *
     * Pass `templateId` for pre-approved Meta/Brevo templates (required for
     * the first message to a contact or outside the 24-hour window).
     * Pass `text` for free-text replies within an active 24-hour customer
     * service conversation window.
     *
     * @param {WhatsAppOptions} options
     * @returns {Promise<boolean>} - True if the message was accepted by Brevo
     */
    sendWhatsApp(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new Error("Brevo service is not initialized. Call init() first.");
            }
            try {
                const request = "templateId" in options
                    ? Object.assign({ contactNumbers: options.contactNumbers, senderNumber: env_1.BREVO_WHATSAPP_SENDER, templateId: options.templateId }, (options.params && { params: options.params })) : {
                    contactNumbers: options.contactNumbers,
                    senderNumber: env_1.BREVO_WHATSAPP_SENDER,
                    text: options.text,
                };
                const response = yield this.client.transactionalWhatsApp.sendWhatsappMessage(request);
                if (!(response === null || response === void 0 ? void 0 : response.messageId)) {
                    throw new CustomError_1.default("Internal Server Error", "Failed to send WhatsApp message via Brevo", CustomError_1.ErrorCodes.INTERNAL_SERVER_ERROR);
                }
                return true;
            }
            catch (error) {
                console.error("Brevo WhatsApp error:", error);
                return false;
            }
        });
    }
}
exports.default = BREVO;
