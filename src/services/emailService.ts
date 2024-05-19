import sendGrid from "@sendgrid/mail";
import { EMAIL_OPERAND, SENDGRID_KEY } from "../utils/env";
import HELPERS from "../utils/helpers";
import errorHandler, { ErrorEnum } from "../utils/error";

type EmailOptions = {
  to?: string;
  from?: string;
  subject: string;
  text?: string;
  html: string;
};

type Action = {
  link: string;
  label: string;
};

class EmailService {
  private sgEmail = sendGrid;
  private defaultOptions = {
    from: EMAIL_OPERAND,
    subject: "From Anansesemfie",
  };
  private logInfo = "";
  public _constructor() {
    this.sgEmail.setApiKey(SENDGRID_KEY as string);
  }
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
                                  <img src="(link unavailable)" alt="Logo" style="width: 100px; height: auto; margin: 0 auto;">
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
                                    true,
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
      if (!options.to || !options.subject)
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Invalid email option"
        );
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
      await this.sgEmail.send(msg);
      this.logInfo = `${HELPERS.loggerInfo.success} sending email: ${
        options.subject
      } @ ${HELPERS.currentTime()}`;
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
}

export default new EmailService();
