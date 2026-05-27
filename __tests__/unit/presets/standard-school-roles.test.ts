import { describe, expect, it } from 'vitest';
import { STANDARD_SCHOOL_ROLES } from '@/presets';

describe('STANDARD_SCHOOL_ROLES', () => {
  it('contains 9 roles', () => {
    expect(STANDARD_SCHOOL_ROLES).toHaveLength(9);
  });

  it('contains exactly one system role (SUPER_ADMIN)', () => {
    const systemRoles = STANDARD_SCHOOL_ROLES.filter((r) => r.isSystem);
    expect(systemRoles).toHaveLength(1);
    expect(systemRoles[0].name).toBe('SUPER_ADMIN');
    expect(systemRoles[0].menuKeys).toEqual([]);
  });

  it('every non-system role has non-empty menuKeys', () => {
    for (const role of STANDARD_SCHOOL_ROLES) {
      if (!role.isSystem) {
        expect(role.menuKeys.length).toBeGreaterThan(0);
      }
    }
  });

  it('school.viewAll virtual key appears on PRINCIPAL, VICE_PRINCIPAL, ACADEMIC_HEAD', () => {
    const withViewAll = STANDARD_SCHOOL_ROLES.filter((r) => r.menuKeys.includes('school.viewAll')).map((r) => r.name).sort();
    expect(withViewAll).toEqual(['ACADEMIC_HEAD', 'PRINCIPAL', 'VICE_PRINCIPAL']);
  });

  it('role names are unique', () => {
    const names = STANDARD_SCHOOL_ROLES.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
