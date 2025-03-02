export type EmailOptions = {
  to: string;
  from?: string;
  subject: string;
  html: string;
};

export type EmailTemplate = {
  items?: { icon: string; title: string; description: string }[];
  actions?: { title: string; link: string }[];
  header: string;
  footer?: string;
  body: string;
};

export interface IEmailService {
  init: () => void;
  send: (options: EmailOptions) => Promise<boolean>;
}
