export { withAdminApi, withAuthApi, withCustomApi, withPublicApi } from '@withwiz/toolkit/next/middleware/wrappers';
export { IApiContext, IUser, TApiHandler } from '@withwiz/toolkit/next/middleware/types';

declare function setPrisma(client: any): void;
declare function getPrisma(): any;

export { getPrisma, setPrisma };
