export { withAdminApi, withAuthApi, withCustomApi, withPublicApi } from '@withwiz/toolkit/middleware/wrappers';
export { IApiContext, IUser, TApiHandler } from '@withwiz/toolkit/middleware/types';

declare function setPrisma(client: any): void;
declare function getPrisma(): any;

export { getPrisma, setPrisma };
