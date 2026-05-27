import BREVO from "../utils/brevo";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";
import type { WhatsAppOptions } from "./utils/interfaces";

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
  private brevo = new BREVO();

  /**
   * Send a transactional WhatsApp message.
   *
   * @throws {CustomError} when `contactNumbers` is empty, or all delivery
   *   attempts fail.
   */
  public async send(options: WhatsAppOptions): Promise<string> {
    this.validateOptions(options);

    try {
      this.brevo.init();
      const sent = await this.brevo.sendWhatsApp(options);

      if (sent) {
        HELPERS.LOG(
          `${HELPERS.loggerInfo.success} WhatsApp message sent @ ${HELPERS.currentTime()}`
        );
        return "WhatsApp message sent successfully";
      }

      throw new CustomError(
        ErrorEnum[500],
        "Failed to send WhatsApp message via Brevo",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    } catch (error) {
      if (error instanceof CustomError) throw error;

      throw new CustomError(
        ErrorEnum[500],
        "An unexpected error occurred while sending WhatsApp message",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private validateOptions(options: WhatsAppOptions): void {
    if (!options.contactNumbers?.length) {
      throw new CustomError(
        ErrorEnum[400],
        "At least one recipient contact number is required",
        ErrorCodes.BAD_REQUEST
      );
    }

    if ("templateId" in options && !options.templateId) {
      throw new CustomError(
        ErrorEnum[400],
        "templateId must be a valid positive integer",
        ErrorCodes.BAD_REQUEST
      );
    }

    if ("text" in options && !options.text?.trim()) {
      throw new CustomError(
        ErrorEnum[400],
        "WhatsApp text message body cannot be empty",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
}

export default new WhatsAppService();
