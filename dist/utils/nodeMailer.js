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
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("./env");
/**
 * @interface IEmailService
 * Defines the required structure for EmailService
 */
class EmailService {
    constructor() {
        this.transporter = null;
    }
    /**
     * Initialize the email transporter with SMTP configuration.
     */
    init() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail", // Replace with your email provider
            auth: {
                user: env_1.EMAIL_OPERAND,
                pass: env_1.EMAIL_PASSWORD,
            },
        });
    }
    /**
     * Send an email with the specified parameters.
     *
     * @param {string} to - The recipient's email address
     * @param {string} subject - The subject of the email
     * @param {string} text - The plain text version of the email content
     * @param {string} html - The HTML version of the email content
     * @returns {Promise<string>} - The response from the email service
     */
    send(_a) {
        return __awaiter(this, arguments, void 0, function* ({ to, subject, html }) {
            if (!this.transporter) {
                throw new Error("EmailService is not initialized. Call init() first.");
            }
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    to,
                    subject,
                    html,
                };
                const info = yield this.transporter.sendMail(mailOptions);
                if (!info)
                    false;
                console.log(`Email sent: ${info.response}`);
                return true;
            }
            catch (error) {
                console.error(`Error sending email: ${error}`);
                throw error;
            }
            finally {
                this.transporter.close();
            }
        });
    }
}
exports.default = EmailService;
