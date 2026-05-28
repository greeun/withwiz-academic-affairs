type HolidayLocale = 'ko-KR';
interface AcademicYearStart {
    /** 1-12 */
    month: number;
    /** 1-31 */
    day: number;
}
interface LocaleOptions {
    /** When null, holiday utilities are disabled. */
    holidays: HolidayLocale | null;
    /** First day of the academic year. Default { month: 3, day: 1 } when omitted. */
    academicYearStart?: AcademicYearStart;
}

export type { AcademicYearStart as A, HolidayLocale as H, LocaleOptions as L };
