export { withAdminApi, withAuthApi, withCustomApi, withPublicApi } from '@withwiz/toolkit/next/middleware/wrappers';
export { IApiContext, IUser, TApiHandler } from '@withwiz/toolkit/next/middleware/types';
export { I as IClock, a as IMailer, b as IObjectStorage, c as ISmsClient, M as MailMessage, S as SmsMessage, d as SmsSendResult, e as StoredObjectMeta, f as SystemClock } from '../clock-ApxcJEIv.js';

declare function setPrisma(client: any): void;
declare function getPrisma(): any;

export { getPrisma, setPrisma };
