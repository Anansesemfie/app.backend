"use strict";
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
const helpers_1 = __importDefault(require("../utils/helpers"));
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
            try {
                const response = yield this.sgEmail.send(email);
                if (!response)
                    false;
                this.logInfo = `SendGrid: Email sent to ${email.to}`;
                return true;
            }
            catch (error) {
                this.logInfo = `SendGrid: Error sending email to ${email.to}`;
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error("An error occurred while sending email");
                }
            }
            finally {
                helpers_1.default.logger(this.logInfo);
            }
        });
    }
}
exports.default = SENDGRID;
