import { S as StaffActor } from '../actor-DlbHf9VQ.mjs';

/**
 * Host-provided auth bridge. The package never touches cookies or JWTs directly.
 * Implementations are typically built on top of @withwiz/toolkit, NextAuth, Clerk, etc.
 */
interface IAuthProvider {
    /**
     * Resolve the actor for the current request, or null if unauthenticated.
     * Implementations must NOT throw on missing/expired auth — return null.
     */
    getCurrentStaff(req: Request): Promise<StaffActor | null>;
}

export type { IAuthProvider };
