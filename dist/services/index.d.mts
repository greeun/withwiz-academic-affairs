import { S as SortOrder } from '../common-CinCPUTw.mjs';
export { P as PaginatedResult, b as buildPaginatedResult } from '../common-CinCPUTw.mjs';
export { A as AcademicCalendarService, a as AdmissionService, b as AttendanceService, C as CounselingService, F as FaqService, S as StaffService, c as StudentService } from '../admission.service-BaG9qOh9.mjs';

interface ListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
}
declare const DEFAULT_PAGE = 1;
declare const DEFAULT_LIMIT = 20;
declare function parseSortParam(sortBy: string, allowed: string[], defaultField: string): {
    field: string;
    order: SortOrder;
};
/**
 * Projection used when a student is embedded in another record (attendance, counseling).
 * Contact details, birth date and notes are deliberately excluded; fetch the student directly
 * when they are needed.
 */
declare const STUDENT_SUMMARY_SELECT: {
    readonly id: true;
    readonly name: true;
    readonly grade: true;
    readonly classGroup: true;
    readonly status: true;
};

export { DEFAULT_LIMIT, DEFAULT_PAGE, type ListParams, STUDENT_SUMMARY_SELECT, SortOrder, parseSortParam };
