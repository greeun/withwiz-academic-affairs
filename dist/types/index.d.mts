export { P as PaginatedResult, S as SortOrder, b as buildPaginatedResult } from '../common-CinCPUTw.mjs';

interface Staff {
    id: string;
    name: string;
    nameEn: string | null;
    role: string;
    department: string | null;
    phone: string | null;
    email: string | null;
    photoUrl: string | null;
    bio: string | null;
    sortOrder: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type AcademicEventType = 'SEMESTER_START' | 'SEMESTER_END' | 'EXAM' | 'VACATION' | 'HOLIDAY' | 'EVENT' | 'FIELD_TRIP' | 'PARENT_MEETING' | 'OTHER';
interface Timetable {
    id: string;
    title: string;
    year: number;
    semester: number;
    schoolLevel: string;
    fileUrl: string | null;
    content: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface AcademicEvent {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date | null;
    type: AcademicEventType;
    schoolLevel: string | null;
    description: string | null;
    isAllDay: boolean;
    color: string | null;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface FaqCategory {
    id: string;
    name: string;
    order: number;
    faqs?: Faq[];
    createdAt: Date;
    updatedAt: Date;
}
interface Faq {
    id: string;
    question: string;
    answer: string;
    categoryId: string | null;
    category?: FaqCategory | null;
    order: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type StudentStatus = 'ACTIVE' | 'ON_LEAVE' | 'GRADUATED' | 'WITHDRAWN';
interface Student {
    id: string;
    name: string;
    grade: number;
    classGroup: string | null;
    birthDate: Date | null;
    phone: string | null;
    parentPhone: string | null;
    parentName: string | null;
    enrolledAt: Date;
    status: StudentStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_LEAVE' | 'EXCUSED';
interface Attendance {
    id: string;
    studentId: string;
    date: Date;
    status: AttendanceStatus;
    reason: string | null;
    createdAt: Date;
}

type CounselingType = 'INITIAL' | 'REGULAR' | 'EMERGENCY' | 'PARENT' | 'ADMISSION';
type CounselingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
interface Counseling {
    id: string;
    studentId: string | null;
    counselorId: string | null;
    type: CounselingType;
    date: Date;
    title: string;
    content: string;
    parentName: string | null;
    parentPhone: string | null;
    status: CounselingStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED';
interface AdmissionSession {
    id: string;
    title: string;
    date: Date;
    location: string | null;
    capacity: number;
    description: string | null;
    isOpen: boolean;
    registrations?: AdmissionRegistration[];
    createdAt: Date;
    updatedAt: Date;
}
interface AdmissionRegistration {
    id: string;
    sessionId: string;
    applicantName: string;
    phone: string;
    email: string | null;
    studentName: string;
    studentGrade: string | null;
    message: string | null;
    status: RegistrationStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type { AcademicEvent, AcademicEventType, AdmissionRegistration, AdmissionSession, Attendance, AttendanceStatus, Counseling, CounselingStatus, CounselingType, Faq, FaqCategory, RegistrationStatus, Staff, Student, StudentStatus, Timetable };
