import { S as SortOrder } from '../common-CinCPUTw.js';
export { P as PaginatedResult, b as buildPaginatedResult } from '../common-CinCPUTw.js';
export { A as AcademicCalendarService, a as AdmissionService, b as AttendanceService, C as CounselingService, F as FaqService, S as StaffService, c as StudentService } from '../admission.service-BsSbZXxc.js';

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

export { DEFAULT_LIMIT, DEFAULT_PAGE, type ListParams, SortOrder, parseSortParam };
