import nodeMailer, { Transporter } from "nodemailer";
import { EmailOptions, IEmailService } from "../services/utils/interfaces";
import { EMAIL_OPERAND, EMAIL_PASSWORD } from "./env";
/**
 * @interface IEmailService
 * Defines the required structure for EmailService
 */

class EmailService implements IEmailService {
  private transporter: Transporter | null;

  constructor() {
    this.transporter = null;
  }

  /**
   * Initialize the email transporter with SMTP configuration.
   */
  init() {
    this.transporter = nodeMailer.createTransport({
      service: "gmail", // Replace with your email provider
      auth: {
        user: EMAIL_OPERAND,
        pass: EMAIL_PASSWORD,
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
  async send({ to, subject, html }: EmailOptions): Promise<boolean> {
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

      const info = await this.transporter.sendMail(mailOptions);
      if (!info) false;
      return true;
    } catch (error) {
      console.error(`Error sending email: ${error}`);
      throw error;
    } finally {
      this.transporter.close();
    }
  }
}

export default EmailService;
