export interface SmsMessage {
  to: string;
  body: string;
  /** Optional sender id; host adapter may ignore. */
  from?: string;
}

export interface SmsSendResult {
  id: string;
  acceptedAt: Date;
}

export interface ISmsClient {
  send(message: SmsMessage): Promise<SmsSendResult>;
  sendMany(messages: SmsMessage[]): Promise<SmsSendResult[]>;
}
