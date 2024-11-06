import { EMAIL_OPERAND, APP_LOGO } from "../utils/env";
import HELPERS from "../utils/helpers";
import errorHandler, { ErrorEnum } from "../utils/error";
import nodeMailer from "../utils/nodeMailer";
import sendGRID from "../utils/sendGrid";
import { EmailOptions } from "./utils/interfaces";

type Action = {
  link: string;
  label: string;
};

class EmailService {
  private sgEmail = new sendGRID();
  private node_mailer = new nodeMailer();
  private defaultOptions = {
    from: EMAIL_OPERAND,
    subject: "From Anansesemfie",
  };
  private logInfo = "";
  public _constructor() {}
  private generateEmailTemplate = (
    body: string,
    header: string = "Hello",
    action?: Action
  ) => `<!DOCTYPE html>
  <html>
  <head>
      <title>Email Template</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
              <td>
                  <table width="600" border="0" cellpadding="0" cellspacing="0" align="center">
                      <tr>
                          <td>
                              <!-- Header -->
                              <header style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                                  <img src="${APP_LOGO}" alt="Logo" style="width: 100px; height: auto; margin: 0 auto;">
                                  <h1 style="margin: 0;">${header}</h1>
                              </header>
                              <script>
									function copyText(text) {
										navigator.clipboard.writeText(text);
									}
								</script>
                              <!-- Content -->
                              <main style="padding: 20px;">
                                  <p style="margin-bottom: 20px;">${body}</p>
                                  ${
                                    action?.label
                                      ? `<a href="${
                                          action?.link
                                        }" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">${
                                          action?.label ?? "Click Here"
                                        }</a>`
                                      : ""
                                  }
                              </main>
                              
                              <!-- Footer -->
                              <footer style="background-color: #f0f0f0; padding: 10px; text-align: center;">
                                  <p style="margin: 0;">&copy; ${HELPERS.currentTime(
                                    "YYYY"
                                  )} Our Company</p>
                              </footer>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`;

  public async sendEmail(options: EmailOptions, action: Action) {
    try {
      await this.checkEmailOptions(options);
      const msg = {
        to: options.to!,
        from: options.from ?? this.defaultOptions.from,
        subject: options.subject ?? this.defaultOptions.subject,
        text: options.text,
        html: await this.generateEmailTemplate(
          options.html!,
          options.subject,
          action
        ),
      };
      const sentBySendGrid = await this.sendEmailWithSendGrid(msg);
      if (!sentBySendGrid) {
        await this.sendEmailWithNodeMailer(msg);
      }

      this.logInfo = `${HELPERS.loggerInfo.success} sending email: ${
        options.subject
      } @ ${HELPERS.currentTime()}`;
      return "Email sent successfully";
    } catch (error: any) {
      this.logInfo = `${HELPERS.loggerInfo.error} sending email: ${
        options.subject
      } @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  private async sendEmailWithNodeMailer(options: EmailOptions) {
    try {
      await this.node_mailer.init();
      return await this.node_mailer.send(options);
    } catch (error: any) {
      throw error;
    }
  }

  private async sendEmailWithSendGrid(options: EmailOptions) {
    try {
      await this.sgEmail.init();
      return await this.sgEmail.send(options);
    } catch (error: any) {
      throw error;
    }
  }

  private async checkEmailOptions(options: EmailOptions) {
    if (!options.to) {
      throw await errorHandler.CustomError(
        ErrorEnum[401],
        "Email recipient is required"
      );
    }
    if (!options.html) {
      throw await errorHandler.CustomError(
        ErrorEnum[401],
        "Email content is required"
      );
    }
  }
}

export default new EmailService();
