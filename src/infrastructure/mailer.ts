export interface MailMessage {
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  from?: string;
}

export interface IMailer {
  send(message: MailMessage): Promise<void>;
}
