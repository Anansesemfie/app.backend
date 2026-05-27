import type { NotifyOptions } from "./utils/interfaces";
import emailService from "./emailService";
import whatsAppService from "./whatsAppService";

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
  public async notify(options: NotifyOptions): Promise<string> {
    const { user, whatsapp, email } = options;

    if (user.whatsappNumber) {
      return await whatsAppService.send({
        contactNumbers: [user.whatsappNumber],
        ...whatsapp,
      });
    }

    return await emailService.sendEmail(
      {
        to: user.email,
        subject: email.subject,
        html: email.html,
      },
      email.template
    );
  }
}

export default new NotificationService();
