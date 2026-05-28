interface RolePreset {
    /** Machine name (matches Role.name). */
    name: string;
    /** Human display name (Korean). */
    displayName: string;
    description?: string;
    /** System role bypasses all menuKey checks. */
    isSystem: boolean;
    /** Menu keys this role grants (includes virtual keys like 'school.viewAll'). */
    menuKeys: readonly string[];
}
declare const STANDARD_SCHOOL_ROLES: readonly RolePreset[];

export { type RolePreset, STANDARD_SCHOOL_ROLES };
