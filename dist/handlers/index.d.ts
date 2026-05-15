import { S as StaffService, A as AcademicCalendarService, F as FaqService, c as StudentService, b as AttendanceService, C as CounselingService, a as AdmissionService } from '../admission.service-BsSbZXxc.js';
import '../common-CinCPUTw.js';

interface DomainConfig {
    staff?: boolean;
    academicCalendar?: boolean;
    faq?: boolean;
    student?: boolean;
    attendance?: boolean;
    counseling?: boolean;
    admission?: boolean;
}
interface AcademicSystemConfig {
    prisma: any;
    domains: DomainConfig;
    withAdminApi?: (handler: Function) => Function;
}
interface HandlerSet {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
}
interface AcademicCalendarHandlerSet {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
    eventList: {
        GET: Function;
        POST: Function;
    };
    eventDetail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
}
interface DashboardHandlerSet {
    stats: {
        GET: Function;
    };
}
interface AcademicSystem {
    services: {
        staff?: StaffService;
        academicCalendar?: AcademicCalendarService;
        faq?: FaqService;
        student?: StudentService;
        attendance?: AttendanceService;
        counseling?: CounselingService;
        admission?: AdmissionService;
    };
    handlers: {
        staff?: HandlerSet;
        academicCalendar?: AcademicCalendarHandlerSet;
        faq?: HandlerSet;
        student?: HandlerSet;
        attendance?: HandlerSet;
        counseling?: HandlerSet;
        admission?: HandlerSet;
        dashboard?: DashboardHandlerSet;
    };
}
declare function createAcademicSystem(config: AcademicSystemConfig): AcademicSystem;

declare function createStaffHandlers(service: StaffService, withAdminApi: (handler: Function) => Function): {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
};

declare function createAcademicCalendarHandlers(service: AcademicCalendarService, withAdminApi: (handler: Function) => Function): {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
    eventList: {
        GET: Function;
        POST: Function;
    };
    eventDetail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
};

declare function createFaqHandlers(service: FaqService, withAdminApi: (handler: Function) => Function): {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
};

declare function createStudentHandlers(service: StudentService, withAdminApi: (handler: Function) => Function): {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
};

declare function createAttendanceHandlers(service: AttendanceService, withAdminApi: (handler: Function) => Function): {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
};

declare function createCounselingHandlers(service: CounselingService, withAdminApi: (handler: Function) => Function): {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
};

declare function createAdmissionHandlers(service: AdmissionService, withAdminApi: (handler: Function) => Function): {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
};

interface DashboardServices {
    staff?: {
        getStats(): Promise<any>;
    };
    academicCalendar?: {
        getStats(): Promise<any>;
    };
    faq?: {
        getStats(): Promise<any>;
    };
    student?: {
        getStats(): Promise<any>;
    };
    attendance?: {
        getStats(): Promise<any>;
    };
    counseling?: {
        getStats(): Promise<any>;
    };
    admission?: {
        getStats(): Promise<any>;
    };
}
declare function createDashboardHandlers(services: DashboardServices, withAdminApi: (handler: Function) => Function): {
    stats: {
        GET: Function;
    };
};

export { createAcademicCalendarHandlers, createAcademicSystem, createAdmissionHandlers, createAttendanceHandlers, createCounselingHandlers, createDashboardHandlers, createFaqHandlers, createStaffHandlers, createStudentHandlers };
