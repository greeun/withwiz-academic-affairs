import { describe, it, expect } from 'vitest';
import { isSafeUrl, safeUrl, hexColor } from '@/validators/common';
import { createStaffSchema, updateStaffSchema } from '@/validators/staff.validator';
import { createAcademicEventSchema } from '@/validators/academic-calendar.validator';
import { updateAttendanceSchema, bulkAttendanceSchema, MAX_BULK_ATTENDANCE } from '@/validators/attendance.validator';
import { updateEmployeeSchema, updateEmployeePiiSchema } from '@/hr/schema';
import { updateStudentSchema } from '@/validators/student.validator';
import { sanitizeFilename } from '@/attendance/sanitize';

describe('safeUrl', () => {
  it('accepts http(s) and site-relative paths only', () => {
    expect(isSafeUrl('https://cdn.example.com/a.png')).toBe(true);
    expect(isSafeUrl('/uploads/a.png')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html;base64,AAAA')).toBe(false);
    expect(isSafeUrl('//evil.example.com/a')).toBe(false);
    expect(safeUrl.safeParse('vbscript:x').success).toBe(false);
    expect(createStaffSchema.safeParse({ name: 'a', role: 'r', photoUrl: 'javascript:1' }).success).toBe(false);
  });

  it('color must be a hex triplet', () => {
    expect(hexColor.safeParse('#D4AF37').success).toBe(true);
    expect(
      createAcademicEventSchema.safeParse({ title: 't', startDate: '2026-01-01', type: 'EXAM', color: 'red;x' }).success,
    ).toBe(false);
  });
});

describe('partial updates do not reset defaulted fields', () => {
  it('status/isPublished stay untouched when omitted', () => {
    expect(updateStudentSchema.parse({ name: 'B' })).toEqual({ name: 'B' });
    expect(updateStaffSchema.parse({ name: 'C' })).toEqual({ name: 'C' });
    expect(updateStaffSchema.parse({ isPublished: false })).toEqual({ isPublished: false });
  });
});

describe('ownership fields are not updatable', () => {
  it('attendance update strips studentId', () => {
    expect(updateAttendanceSchema.parse({ studentId: 'x', reason: 'r' })).toEqual({ reason: 'r' });
    const tooMany = Array(MAX_BULK_ATTENDANCE + 1).fill({ studentId: 's', date: '2026-01-01', status: 'PRESENT' });
    expect(bulkAttendanceSchema.safeParse({ records: tooMany }).success).toBe(false);
  });

  it('hr general update strips nationalId; PII schema keeps it', () => {
    expect(updateEmployeeSchema.parse({ nationalId: '901010-1234567', name: 'A' })).toEqual({ name: 'A' });
    expect(updateEmployeePiiSchema.parse({ nationalId: '901010-1234567' })).toEqual({ nationalId: '901010-1234567' });
  });
});

describe('sanitizeFilename', () => {
  it('neutralizes header delimiters, dotfiles and unicode line breaks', () => {
    expect(sanitizeFilename('a"; filename="evil.exe')).toBe('a__ filename=_evil.exe');
    expect(sanitizeFilename('.htaccess')).toBe('htaccess');
    expect(sanitizeFilename('..')).toBe('_');
    expect(sanitizeFilename('xy z')).toBe('x_y_z');
    expect(sanitizeFilename("it's;ok")).toBe('it_s_ok');
  });
});
