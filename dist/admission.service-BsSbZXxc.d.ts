import { P as PaginatedResult } from './common-CinCPUTw.js';

interface ListParams$4 {
    page?: number;
    limit?: number;
    sortBy?: string;
    role?: string;
}
declare class StaffService {
    private prisma;
    constructor(prisma: any);
    list(params: ListParams$4): Promise<PaginatedResult<any>>;
    getById(id: string): Promise<any>;
    create(data: Record<string, unknown>): Promise<any>;
    update(id: string, data: Record<string, unknown>): Promise<any>;
    delete(id: string): Promise<any>;
    getStats(): Promise<{
        total: number;
        byRole: Record<string, number>;
    }>;
    reorder(ids: string[]): Promise<void>;
}

interface TimetableListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    year?: number;
    semester?: number;
    schoolLevel?: string;
}
interface EventListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    type?: string;
    schoolLevel?: string;
    isPublished?: boolean;
}
declare class AcademicCalendarService {
    private prisma;
    constructor(prisma: any);
    listTimetables(params: TimetableListParams): Promise<PaginatedResult<any>>;
    getTimetableById(id: string): Promise<any>;
    createTimetable(data: Record<string, unknown>): Promise<any>;
    updateTimetable(id: string, data: Record<string, unknown>): Promise<any>;
    deleteTimetable(id: string): Promise<any>;
    getActiveTimetables(): Promise<any>;
    listEvents(params: EventListParams): Promise<PaginatedResult<any>>;
    getEventById(id: string): Promise<any>;
    createEvent(data: Record<string, unknown>): Promise<any>;
    updateEvent(id: string, data: Record<string, unknown>): Promise<any>;
    deleteEvent(id: string): Promise<any>;
    getMonthlyEvents(year: number, month: number): Promise<any>;
    getYearlyEvents(year: number): Promise<any>;
    getStats(): Promise<{
        totalTimetables: number;
        totalEvents: number;
        byEventType: Record<string, number>;
    }>;
}

interface ListParams$3 {
    page?: number;
    limit?: number;
    sortBy?: string;
    categoryId?: string;
    isPublished?: boolean;
}
declare class FaqService {
    private prisma;
    constructor(prisma: any);
    list(params: ListParams$3): Promise<PaginatedResult<any>>;
    getById(id: string): Promise<any>;
    create(data: Record<string, unknown>): Promise<any>;
    update(id: string, data: Record<string, unknown>): Promise<any>;
    delete(id: string): Promise<any>;
    reorder(ids: string[]): Promise<void>;
    listCategories(): Promise<any>;
    createCategory(data: Record<string, unknown>): Promise<any>;
    updateCategory(id: string, data: Record<string, unknown>): Promise<any>;
    deleteCategory(id: string): Promise<any>;
    reorderCategories(ids: string[]): Promise<void>;
    getStats(): Promise<{
        total: number;
        byCategory: Record<string, number>;
    }>;
}

interface ListParams$2 {
    page?: number;
    limit?: number;
    sortBy?: string;
    grade?: number;
    status?: string;
    classGroup?: string;
}
declare class StudentService {
    private prisma;
    constructor(prisma: any);
    list(params: ListParams$2): Promise<PaginatedResult<any>>;
    getById(id: string): Promise<any>;
    create(data: Record<string, unknown>): Promise<any>;
    update(id: string, data: Record<string, unknown>): Promise<any>;
    delete(id: string): Promise<any>;
    getByGrade(grade: number): Promise<any>;
    updateStatus(id: string, status: string): Promise<any>;
    getStats(): Promise<{
        total: number;
        byStatus: Record<string, number>;
        byGrade: Record<string, number>;
    }>;
}

interface ListParams$1 {
    page?: number;
    limit?: number;
    sortBy?: string;
    studentId?: string;
    status?: string;
    date?: Date;
}
interface AttendanceRecord {
    studentId: string;
    date: Date;
    status: string;
    reason?: string;
}
declare class AttendanceService {
    private prisma;
    constructor(prisma: any);
    list(params: ListParams$1): Promise<PaginatedResult<any>>;
    getById(id: string): Promise<any>;
    create(data: Record<string, unknown>): Promise<any>;
    update(id: string, data: Record<string, unknown>): Promise<any>;
    delete(id: string): Promise<any>;
    bulkCreate(records: AttendanceRecord[]): Promise<any[]>;
    getDailyReport(date: Date): Promise<any>;
    getStudentReport(studentId: string, startDate: Date, endDate: Date): Promise<any>;
    getStats(): Promise<{
        total: number;
        byStatus: Record<string, number>;
    }>;
}

interface ListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    studentId?: string;
    type?: string;
    status?: string;
    counselorId?: string;
}
declare class CounselingService {
    private prisma;
    constructor(prisma: any);
    list(params: ListParams): Promise<PaginatedResult<any>>;
    getById(id: string): Promise<any>;
    create(data: Record<string, unknown>): Promise<any>;
    update(id: string, data: Record<string, unknown>): Promise<any>;
    delete(id: string): Promise<any>;
    getUpcoming(): Promise<any>;
    getByStudent(studentId: string): Promise<any>;
    getStats(): Promise<{
        total: number;
        byType: Record<string, number>;
        byStatus: Record<string, number>;
    }>;
}

interface SessionListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    isOpen?: boolean;
}
interface RegistrationListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sessionId?: string;
    status?: string;
}
declare class AdmissionService {
    private prisma;
    constructor(prisma: any);
    listSessions(params?: SessionListParams): Promise<PaginatedResult<any>>;
    getSessionById(id: string): Promise<any>;
    createSession(data: Record<string, unknown>): Promise<any>;
    updateSession(id: string, data: Record<string, unknown>): Promise<any>;
    deleteSession(id: string): Promise<any>;
    getOpenSessions(): Promise<any>;
    listRegistrations(sessionId: string, params?: RegistrationListParams): Promise<PaginatedResult<any>>;
    register(sessionId: string, data: Record<string, unknown>): Promise<any>;
    updateRegistrationStatus(id: string, status: string): Promise<any>;
    getStats(): Promise<{
        totalSessions: number;
        totalRegistrations: number;
        byStatus: Record<string, number>;
    }>;
}

export { AcademicCalendarService as A, CounselingService as C, FaqService as F, StaffService as S, AdmissionService as a, AttendanceService as b, StudentService as c };
