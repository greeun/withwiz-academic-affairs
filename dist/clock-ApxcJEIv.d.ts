interface SmsMessage {
    to: string;
    body: string;
    /** Optional sender id; host adapter may ignore. */
    from?: string;
}
interface SmsSendResult {
    id: string;
    acceptedAt: Date;
}
interface ISmsClient {
    send(message: SmsMessage): Promise<SmsSendResult>;
    sendMany(messages: SmsMessage[]): Promise<SmsSendResult[]>;
}

interface MailMessage {
    to: string;
    subject: string;
    bodyHtml: string;
    bodyText?: string;
    from?: string;
}
interface IMailer {
    send(message: MailMessage): Promise<void>;
}

interface StoredObjectMeta {
    url: string;
    contentType?: string;
    size?: number;
}
interface IObjectStorage {
    /** Persist bytes and return a public URL. Caller controls keying. */
    put(key: string, body: ArrayBuffer | Uint8Array, contentType: string): Promise<StoredObjectMeta>;
    /** Best-effort delete. Implementations should NOT throw on missing. */
    delete(key: string): Promise<void>;
}

interface IClock {
    now(): Date;
}
declare class SystemClock implements IClock {
    now(): Date;
}

export { type IClock as I, type MailMessage as M, type SmsMessage as S, type IMailer as a, type IObjectStorage as b, type ISmsClient as c, type SmsSendResult as d, type StoredObjectMeta as e, SystemClock as f };
