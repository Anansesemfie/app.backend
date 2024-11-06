export type EmailOptions = {
  to?: string;
  from?: string;
  subject: string;
  text?: string;
  html: string;
};

export interface IEmailService {
  init: () => void;
  send: (options: EmailOptions) => Promise<boolean>;
}
