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
const emailService_1 = __importDefault(require("./emailService"));
const whatsAppService_1 = __importDefault(require("./whatsAppService"));
/**
 * NotificationService
 *
 * Single entry-point for all user-facing notifications.
 * Automatically routes to WhatsApp when the user has a number on file,
 * otherwise falls back to email. Callers supply both payloads every time
 * and never need to know which channel will be used.
 *
 * Usage:
 *   await notificationService.notify({
 *     user,
 *     whatsapp: { templateId: 7, params: { name: user.username } },
 *     email: {
 *       subject: "Your subscription is active",
 *       html: "Your subscription is now active.",
 *       template: { header: "Subscription Active", body: "..." },
 *     },
 *   });
 */
class NotificationService {
    /**
     * Send a notification to the user on the best available channel.
     *
     * @returns A human-readable string describing which channel was used.
     */
    notify(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, whatsapp, email } = options;
            if (user.whatsappNumber) {
                return yield whatsAppService_1.default.send(Object.assign({ contactNumbers: [user.whatsappNumber] }, whatsapp));
            }
            return yield emailService_1.default.sendEmail({
                to: user.email,
                subject: email.subject,
                html: email.html,
            }, email.template);
        });
    }
}
exports.default = new NotificationService();
