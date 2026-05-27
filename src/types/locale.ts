export type HolidayLocale = 'ko-KR';

export interface AcademicYearStart {
  /** 1-12 */
  month: number;
  /** 1-31 */
  day: number;
}

export interface LocaleOptions {
  /** When null, holiday utilities are disabled. */
  holidays: HolidayLocale | null;
  /** First day of the academic year. Default { month: 3, day: 1 } when omitted. */
  academicYearStart?: AcademicYearStart;
}
