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

// ─── WhatsApp ────────────────────────────────────────────────────────────────

/**
 * Options for a transactional WhatsApp message via Brevo.
 *
 * Either `templateId` (pre-approved Brevo/Meta template) OR `text` is required.
 *   - Template messages: pass `templateId` and optional `params` for variable substitution.
 *   - Free-text messages: pass `text` (only allowed within the 24-hour customer-service window).
 */
export type WhatsAppOptions =
  | {
      /** One or more recipient phone numbers in E.164 format, e.g. "+233241234567" */
      contactNumbers: string[];
      /** Brevo template ID (created in the Brevo dashboard). */
      templateId: number;
      /** Key/value pairs substituted into the template's {{variable}} placeholders. */
      params?: Record<string, unknown>;
    }
  | {
      contactNumbers: string[];
      /** Free-text body — only usable inside a 24-hour reply window. */
      text: string;
    };

export interface IWhatsAppService {
  init: () => void;
  sendWhatsApp: (options: WhatsAppOptions) => Promise<boolean>;
}

// ─── Unified Notification ─────────────────────────────────────────────────────

/**
 * Channel-agnostic notification payload.
 *
 * Pass both an `email` and a `whatsapp` payload every time.
 * NotificationService picks the channel automatically:
 *   - user has whatsappNumber  →  WhatsApp
 *   - user has no number       →  Email
 *
 * Neither `contactNumbers` nor `to` need to be supplied; they are filled
 * from the user object by the service.
 */
export type NotifyOptions = {
  /** Routing info — only email and whatsappNumber are needed */
  user: {
    email: string;
    whatsappNumber?: string;
  };

  /** WhatsApp payload (contactNumbers injected automatically) */
  whatsapp:
    | { templateId: number; params?: Record<string, unknown> }
    | { text: string };

  /** Email payload (to injected automatically) */
  email: {
    subject: string;
    /** Plain-text / minimal HTML fallback — used by the email validator */
    html: string;
    template: EmailTemplate;
  };
};
