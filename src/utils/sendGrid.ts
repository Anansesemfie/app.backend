import sendGrid from "@sendgrid/mail";
import { EMAIL_OPERAND, SENDGRID_KEY } from "../utils/env";
import { EmailOptions, IEmailService } from "../services/utils/interfaces";

import HELPERS from "../utils/helpers";
class SENDGRID implements IEmailService {
  private sgEmail = sendGrid;
  private defaultOptions = {
    from: EMAIL_OPERAND,
    subject: "From Anansesemfie",
  };
  private logInfo = "";
  public init() {
    this.sgEmail.setApiKey(SENDGRID_KEY);
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
  public async send(options: EmailOptions) {
    const email = { ...this.defaultOptions, ...options };

    try {
      const response = await this.sgEmail.send(email);
      if (!response) false;

      this.logInfo = `SendGrid: Email sent to ${email.to}`;
      return true;
    } catch (error: unknown) {
      this.logInfo = `SendGrid: Error sending email to ${email.to}`;
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An error occurred while sending email");
      }
    } finally {
      HELPERS.logger(this.logInfo);
    }
  }
}

export default SENDGRID;
