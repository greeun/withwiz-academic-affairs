interface StaffActor {
    /** User id from host auth provider. Always present. */
    userId: string;
    /** Staff record id when the user is registered as staff. */
    staffId?: string;
    /** Assigned role (single). System roles bypass menuKey checks. */
    role?: {
        key: string;
        isSystem: boolean;
    };
    /** Flattened permissions (menuKeys + virtual keys e.g. "school.viewAll"). */
    permissions: string[];
    /** Group ids the user belongs to. */
    groups: string[];
}

export type { StaffActor as S };
