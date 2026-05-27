import type { StaffActor } from '../types/actor';

/**
 * Host-provided auth bridge. The package never touches cookies or JWTs directly.
 * Implementations are typically built on top of @withwiz/toolkit, NextAuth, Clerk, etc.
 */
export interface IAuthProvider {
  /**
   * Resolve the actor for the current request, or null if unauthenticated.
   * Implementations must NOT throw on missing/expired auth — return null.
   */
  getCurrentStaff(req: Request): Promise<StaffActor | null>;
}
