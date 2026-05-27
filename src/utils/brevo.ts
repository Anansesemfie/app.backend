import { BrevoClient } from "@getbrevo/brevo";

import type {
  EmailOptions,
  IEmailService,
  IWhatsAppService,
  WhatsAppOptions,
} from "../services/utils/interfaces";
import CustomError, { ErrorCodes } from "./CustomError";
import { BREVO_KEY, BREVO_WHATSAPP_SENDER, EMAIL_OPERAND } from "./env";

class BREVO implements IEmailService, IWhatsAppService {
  private client: BrevoClient | null = null;
  private readonly defaultEmailOptions = {
    from: EMAIL_OPERAND,
    subject: "From Anansesemfie",
  };

  public init() {
    if (this.client) return; // already initialised — don't recreate on every send
    this.client = new BrevoClient({
      apiKey: BREVO_KEY,
    });
  }

  // ─── Email ─────────────────────────────────────────────────────────────────

  /**
   * Send a transactional email using Brevo.
   *
   * @param {EmailOptions} options - The email parameters
   * @returns {Promise<boolean>} - True if successful
   */
  public async send(options: EmailOptions): Promise<boolean> {
    if (!this.client) {
      throw new Error("Brevo service is not initialized. Call init() first.");
    }

    const email = { ...this.defaultEmailOptions, ...options };

    try {
      const response = await this.client.transactionalEmails.sendTransacEmail({
        subject: email.subject,
        htmlContent: email.html,
        sender: {
          email: email.from || EMAIL_OPERAND,
          name: "Anansesemfie",
        },
        to: [{ email: email.to }],
      });

      if (!response?.messageId) {
        throw new CustomError(
          "Internal Server Error",
          "Failed to send email via Brevo",
          ErrorCodes.INTERNAL_SERVER_ERROR
        );
      }
      return true;
    } catch (error) {
      console.error("Brevo email error:", error);
      return false;
    }
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
  public async sendWhatsApp(options: WhatsAppOptions): Promise<boolean> {
    if (!this.client) {
      throw new Error("Brevo service is not initialized. Call init() first.");
    }

    try {
      const request =
        "templateId" in options
          ? {
              contactNumbers: options.contactNumbers,
              senderNumber: BREVO_WHATSAPP_SENDER,
              templateId: options.templateId,
              ...(options.params && { params: options.params }),
            }
          : {
              contactNumbers: options.contactNumbers,
              senderNumber: BREVO_WHATSAPP_SENDER,
              text: options.text,
            };

      const response =
        await this.client.transactionalWhatsApp.sendWhatsappMessage(request);

      if (!response?.messageId) {
        throw new CustomError(
          "Internal Server Error",
          "Failed to send WhatsApp message via Brevo",
          ErrorCodes.INTERNAL_SERVER_ERROR
        );
      }
      return true;
    } catch (error) {
      console.error("Brevo WhatsApp error:", error);
      return false;
    }
  }
}

export default BREVO;
