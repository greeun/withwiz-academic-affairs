import { z } from 'zod';

declare const createStaffSchema: z.ZodObject<{
    name: z.ZodString;
    nameEn: z.ZodOptional<z.ZodString>;
    role: z.ZodString;
    department: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    photoUrl: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    isPublished: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    role: string;
    name: string;
    sortOrder: number;
    isPublished: boolean;
    email?: string | undefined;
    nameEn?: string | undefined;
    department?: string | undefined;
    phone?: string | undefined;
    photoUrl?: string | undefined;
    bio?: string | undefined;
}, {
    role: string;
    name: string;
    email?: string | undefined;
    sortOrder?: number | undefined;
    isPublished?: boolean | undefined;
    nameEn?: string | undefined;
    department?: string | undefined;
    phone?: string | undefined;
    photoUrl?: string | undefined;
    bio?: string | undefined;
}>;
declare const updateStaffSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    nameEn: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    role: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    photoUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isPublished: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    role?: string | undefined;
    name?: string | undefined;
    sortOrder?: number | undefined;
    isPublished?: boolean | undefined;
    nameEn?: string | undefined;
    department?: string | undefined;
    phone?: string | undefined;
    photoUrl?: string | undefined;
    bio?: string | undefined;
}, {
    email?: string | undefined;
    role?: string | undefined;
    name?: string | undefined;
    sortOrder?: number | undefined;
    isPublished?: boolean | undefined;
    nameEn?: string | undefined;
    department?: string | undefined;
    phone?: string | undefined;
    photoUrl?: string | undefined;
    bio?: string | undefined;
}>;
type CreateStaffDto = z.infer<typeof createStaffSchema>;
type UpdateStaffDto = z.infer<typeof updateStaffSchema>;

declare const academicEventTypeEnum: z.ZodEnum<["SEMESTER_START", "SEMESTER_END", "EXAM", "VACATION", "HOLIDAY", "EVENT", "FIELD_TRIP", "PARENT_MEETING", "OTHER"]>;
declare const createTimetableSchema: z.ZodObject<{
    title: z.ZodString;
    year: z.ZodNumber;
    semester: z.ZodNumber;
    schoolLevel: z.ZodString;
    fileUrl: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    year: number;
    semester: number;
    schoolLevel: string;
    isActive: boolean;
    content?: string | undefined;
    fileUrl?: string | undefined;
}, {
    title: string;
    year: number;
    semester: number;
    schoolLevel: string;
    content?: string | undefined;
    fileUrl?: string | undefined;
    isActive?: boolean | undefined;
}>;
declare const updateTimetableSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodNumber>;
    semester: z.ZodOptional<z.ZodNumber>;
    schoolLevel: z.ZodOptional<z.ZodString>;
    fileUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    content: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    year?: number | undefined;
    semester?: number | undefined;
    schoolLevel?: string | undefined;
    fileUrl?: string | undefined;
    isActive?: boolean | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    year?: number | undefined;
    semester?: number | undefined;
    schoolLevel?: string | undefined;
    fileUrl?: string | undefined;
    isActive?: boolean | undefined;
}>;
declare const createAcademicEventSchema: z.ZodObject<{
    title: z.ZodString;
    startDate: z.ZodDate;
    endDate: z.ZodOptional<z.ZodDate>;
    type: z.ZodEnum<["SEMESTER_START", "SEMESTER_END", "EXAM", "VACATION", "HOLIDAY", "EVENT", "FIELD_TRIP", "PARENT_MEETING", "OTHER"]>;
    schoolLevel: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    isAllDay: z.ZodDefault<z.ZodBoolean>;
    color: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    type: "SEMESTER_START" | "SEMESTER_END" | "EXAM" | "VACATION" | "HOLIDAY" | "EVENT" | "FIELD_TRIP" | "PARENT_MEETING" | "OTHER";
    startDate: Date;
    isPublished: boolean;
    isAllDay: boolean;
    color?: string | undefined;
    schoolLevel?: string | undefined;
    endDate?: Date | undefined;
    description?: string | undefined;
}, {
    title: string;
    type: "SEMESTER_START" | "SEMESTER_END" | "EXAM" | "VACATION" | "HOLIDAY" | "EVENT" | "FIELD_TRIP" | "PARENT_MEETING" | "OTHER";
    startDate: Date;
    color?: string | undefined;
    schoolLevel?: string | undefined;
    isPublished?: boolean | undefined;
    endDate?: Date | undefined;
    description?: string | undefined;
    isAllDay?: boolean | undefined;
}>;
declare const updateAcademicEventSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    type: z.ZodOptional<z.ZodEnum<["SEMESTER_START", "SEMESTER_END", "EXAM", "VACATION", "HOLIDAY", "EVENT", "FIELD_TRIP", "PARENT_MEETING", "OTHER"]>>;
    schoolLevel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isAllDay: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isPublished: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    type?: "SEMESTER_START" | "SEMESTER_END" | "EXAM" | "VACATION" | "HOLIDAY" | "EVENT" | "FIELD_TRIP" | "PARENT_MEETING" | "OTHER" | undefined;
    color?: string | undefined;
    startDate?: Date | undefined;
    schoolLevel?: string | undefined;
    isPublished?: boolean | undefined;
    endDate?: Date | undefined;
    description?: string | undefined;
    isAllDay?: boolean | undefined;
}, {
    title?: string | undefined;
    type?: "SEMESTER_START" | "SEMESTER_END" | "EXAM" | "VACATION" | "HOLIDAY" | "EVENT" | "FIELD_TRIP" | "PARENT_MEETING" | "OTHER" | undefined;
    color?: string | undefined;
    startDate?: Date | undefined;
    schoolLevel?: string | undefined;
    isPublished?: boolean | undefined;
    endDate?: Date | undefined;
    description?: string | undefined;
    isAllDay?: boolean | undefined;
}>;
type CreateTimetableDto = z.infer<typeof createTimetableSchema>;
type UpdateTimetableDto = z.infer<typeof updateTimetableSchema>;
type CreateAcademicEventDto = z.infer<typeof createAcademicEventSchema>;
type UpdateAcademicEventDto = z.infer<typeof updateAcademicEventSchema>;

declare const createFaqSchema: z.ZodObject<{
    question: z.ZodString;
    answer: z.ZodString;
    categoryId: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodNumber>;
    isPublished: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    isPublished: boolean;
    question: string;
    answer: string;
    categoryId?: string | undefined;
}, {
    question: string;
    answer: string;
    order?: number | undefined;
    isPublished?: boolean | undefined;
    categoryId?: string | undefined;
}>;
declare const updateFaqSchema: z.ZodObject<{
    question: z.ZodOptional<z.ZodString>;
    answer: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isPublished: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    order?: number | undefined;
    isPublished?: boolean | undefined;
    question?: string | undefined;
    categoryId?: string | undefined;
    answer?: string | undefined;
}, {
    order?: number | undefined;
    isPublished?: boolean | undefined;
    question?: string | undefined;
    categoryId?: string | undefined;
    answer?: string | undefined;
}>;
declare const createFaqCategorySchema: z.ZodObject<{
    name: z.ZodString;
    order: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    order: number;
    name: string;
}, {
    name: string;
    order?: number | undefined;
}>;
declare const updateFaqCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    order?: number | undefined;
    name?: string | undefined;
}, {
    order?: number | undefined;
    name?: string | undefined;
}>;
type CreateFaqDto = z.infer<typeof createFaqSchema>;
type UpdateFaqDto = z.infer<typeof updateFaqSchema>;
type CreateFaqCategoryDto = z.infer<typeof createFaqCategorySchema>;
type UpdateFaqCategoryDto = z.infer<typeof updateFaqCategorySchema>;

declare const studentStatusEnum: z.ZodEnum<["ACTIVE", "ON_LEAVE", "GRADUATED", "WITHDRAWN"]>;
declare const createStudentSchema: z.ZodObject<{
    name: z.ZodString;
    grade: z.ZodNumber;
    classGroup: z.ZodOptional<z.ZodString>;
    birthDate: z.ZodOptional<z.ZodDate>;
    phone: z.ZodOptional<z.ZodString>;
    parentPhone: z.ZodOptional<z.ZodString>;
    parentName: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["ACTIVE", "ON_LEAVE", "GRADUATED", "WITHDRAWN"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    grade: number;
    status: "ACTIVE" | "ON_LEAVE" | "GRADUATED" | "WITHDRAWN";
    classGroup?: string | undefined;
    phone?: string | undefined;
    birthDate?: Date | undefined;
    parentPhone?: string | undefined;
    parentName?: string | undefined;
    notes?: string | undefined;
}, {
    name: string;
    grade: number;
    status?: "ACTIVE" | "ON_LEAVE" | "GRADUATED" | "WITHDRAWN" | undefined;
    classGroup?: string | undefined;
    phone?: string | undefined;
    birthDate?: Date | undefined;
    parentPhone?: string | undefined;
    parentName?: string | undefined;
    notes?: string | undefined;
}>;
declare const updateStudentSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    grade: z.ZodOptional<z.ZodNumber>;
    classGroup: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    birthDate: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["ACTIVE", "ON_LEAVE", "GRADUATED", "WITHDRAWN"]>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    grade?: number | undefined;
    status?: "ACTIVE" | "ON_LEAVE" | "GRADUATED" | "WITHDRAWN" | undefined;
    classGroup?: string | undefined;
    phone?: string | undefined;
    birthDate?: Date | undefined;
    parentPhone?: string | undefined;
    parentName?: string | undefined;
    notes?: string | undefined;
}, {
    name?: string | undefined;
    grade?: number | undefined;
    status?: "ACTIVE" | "ON_LEAVE" | "GRADUATED" | "WITHDRAWN" | undefined;
    classGroup?: string | undefined;
    phone?: string | undefined;
    birthDate?: Date | undefined;
    parentPhone?: string | undefined;
    parentName?: string | undefined;
    notes?: string | undefined;
}>;
type CreateStudentDto = z.infer<typeof createStudentSchema>;
type UpdateStudentDto = z.infer<typeof updateStudentSchema>;

declare const attendanceStatusEnum: z.ZodEnum<["PRESENT", "ABSENT", "LATE", "EARLY_LEAVE", "EXCUSED"]>;
declare const createAttendanceSchema: z.ZodObject<{
    studentId: z.ZodString;
    date: z.ZodDate;
    status: z.ZodEnum<["PRESENT", "ABSENT", "LATE", "EARLY_LEAVE", "EXCUSED"]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: Date;
    status: "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "EXCUSED";
    studentId: string;
    reason?: string | undefined;
}, {
    date: Date;
    status: "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "EXCUSED";
    studentId: string;
    reason?: string | undefined;
}>;
declare const updateAttendanceSchema: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodDate>;
    status: z.ZodOptional<z.ZodEnum<["PRESENT", "ABSENT", "LATE", "EARLY_LEAVE", "EXCUSED"]>>;
    reason: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    date?: Date | undefined;
    status?: "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "EXCUSED" | undefined;
    studentId?: string | undefined;
    reason?: string | undefined;
}, {
    date?: Date | undefined;
    status?: "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "EXCUSED" | undefined;
    studentId?: string | undefined;
    reason?: string | undefined;
}>;
declare const bulkAttendanceSchema: z.ZodObject<{
    records: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        date: z.ZodDate;
        status: z.ZodEnum<["PRESENT", "ABSENT", "LATE", "EARLY_LEAVE", "EXCUSED"]>;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        status: "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "EXCUSED";
        studentId: string;
        reason?: string | undefined;
    }, {
        date: Date;
        status: "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "EXCUSED";
        studentId: string;
        reason?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    records: {
        date: Date;
        status: "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "EXCUSED";
        studentId: string;
        reason?: string | undefined;
    }[];
}, {
    records: {
        date: Date;
        status: "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "EXCUSED";
        studentId: string;
        reason?: string | undefined;
    }[];
}>;
type CreateAttendanceDto = z.infer<typeof createAttendanceSchema>;
type UpdateAttendanceDto = z.infer<typeof updateAttendanceSchema>;
type BulkAttendanceDto = z.infer<typeof bulkAttendanceSchema>;

declare const counselingTypeEnum: z.ZodEnum<["INITIAL", "REGULAR", "EMERGENCY", "PARENT", "ADMISSION"]>;
declare const counselingStatusEnum: z.ZodEnum<["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]>;
declare const createCounselingSchema: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodString>;
    counselorId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["INITIAL", "REGULAR", "EMERGENCY", "PARENT", "ADMISSION"]>;
    date: z.ZodDate;
    title: z.ZodString;
    content: z.ZodString;
    parentName: z.ZodOptional<z.ZodString>;
    parentPhone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    type: "INITIAL" | "REGULAR" | "EMERGENCY" | "PARENT" | "ADMISSION";
    content: string;
    date: Date;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    studentId?: string | undefined;
    counselorId?: string | undefined;
    parentPhone?: string | undefined;
    parentName?: string | undefined;
    notes?: string | undefined;
}, {
    title: string;
    type: "INITIAL" | "REGULAR" | "EMERGENCY" | "PARENT" | "ADMISSION";
    content: string;
    date: Date;
    status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | undefined;
    studentId?: string | undefined;
    counselorId?: string | undefined;
    parentPhone?: string | undefined;
    parentName?: string | undefined;
    notes?: string | undefined;
}>;
declare const updateCounselingSchema: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    counselorId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodEnum<["INITIAL", "REGULAR", "EMERGENCY", "PARENT", "ADMISSION"]>>;
    date: z.ZodOptional<z.ZodDate>;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    parentName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    type?: "INITIAL" | "REGULAR" | "EMERGENCY" | "PARENT" | "ADMISSION" | undefined;
    content?: string | undefined;
    date?: Date | undefined;
    status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | undefined;
    studentId?: string | undefined;
    counselorId?: string | undefined;
    parentPhone?: string | undefined;
    parentName?: string | undefined;
    notes?: string | undefined;
}, {
    title?: string | undefined;
    type?: "INITIAL" | "REGULAR" | "EMERGENCY" | "PARENT" | "ADMISSION" | undefined;
    content?: string | undefined;
    date?: Date | undefined;
    status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | undefined;
    studentId?: string | undefined;
    counselorId?: string | undefined;
    parentPhone?: string | undefined;
    parentName?: string | undefined;
    notes?: string | undefined;
}>;
type CreateCounselingDto = z.infer<typeof createCounselingSchema>;
type UpdateCounselingDto = z.infer<typeof updateCounselingSchema>;

declare const registrationStatusEnum: z.ZodEnum<["PENDING", "CONFIRMED", "CANCELLED", "ATTENDED"]>;
declare const createAdmissionSessionSchema: z.ZodObject<{
    title: z.ZodString;
    date: z.ZodDate;
    location: z.ZodOptional<z.ZodString>;
    capacity: z.ZodDefault<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    isOpen: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    date: Date;
    isOpen: boolean;
    capacity: number;
    description?: string | undefined;
    location?: string | undefined;
}, {
    title: string;
    date: Date;
    isOpen?: boolean | undefined;
    description?: string | undefined;
    location?: string | undefined;
    capacity?: number | undefined;
}>;
declare const updateAdmissionSessionSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodDate>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    capacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isOpen: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    date?: Date | undefined;
    isOpen?: boolean | undefined;
    description?: string | undefined;
    location?: string | undefined;
    capacity?: number | undefined;
}, {
    title?: string | undefined;
    date?: Date | undefined;
    isOpen?: boolean | undefined;
    description?: string | undefined;
    location?: string | undefined;
    capacity?: number | undefined;
}>;
declare const createAdmissionRegistrationSchema: z.ZodObject<{
    sessionId: z.ZodString;
    applicantName: z.ZodString;
    phone: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    studentName: z.ZodString;
    studentGrade: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["PENDING", "CONFIRMED", "CANCELLED", "ATTENDED"]>>;
}, "strip", z.ZodTypeAny, {
    status: "CANCELLED" | "PENDING" | "CONFIRMED" | "ATTENDED";
    applicantName: string;
    sessionId: string;
    phone: string;
    studentName: string;
    email?: string | undefined;
    message?: string | undefined;
    studentGrade?: string | undefined;
}, {
    applicantName: string;
    sessionId: string;
    phone: string;
    studentName: string;
    email?: string | undefined;
    status?: "CANCELLED" | "PENDING" | "CONFIRMED" | "ATTENDED" | undefined;
    message?: string | undefined;
    studentGrade?: string | undefined;
}>;
declare const updateAdmissionRegistrationSchema: z.ZodObject<{
    sessionId: z.ZodOptional<z.ZodString>;
    applicantName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    studentName: z.ZodOptional<z.ZodString>;
    studentGrade: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    message: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["PENDING", "CONFIRMED", "CANCELLED", "ATTENDED"]>>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    status?: "CANCELLED" | "PENDING" | "CONFIRMED" | "ATTENDED" | undefined;
    applicantName?: string | undefined;
    sessionId?: string | undefined;
    phone?: string | undefined;
    message?: string | undefined;
    studentName?: string | undefined;
    studentGrade?: string | undefined;
}, {
    email?: string | undefined;
    status?: "CANCELLED" | "PENDING" | "CONFIRMED" | "ATTENDED" | undefined;
    applicantName?: string | undefined;
    sessionId?: string | undefined;
    phone?: string | undefined;
    message?: string | undefined;
    studentName?: string | undefined;
    studentGrade?: string | undefined;
}>;
type CreateAdmissionSessionDto = z.infer<typeof createAdmissionSessionSchema>;
type UpdateAdmissionSessionDto = z.infer<typeof updateAdmissionSessionSchema>;
type CreateAdmissionRegistrationDto = z.infer<typeof createAdmissionRegistrationSchema>;
type UpdateAdmissionRegistrationDto = z.infer<typeof updateAdmissionRegistrationSchema>;

export { type BulkAttendanceDto, type CreateAcademicEventDto, type CreateAdmissionRegistrationDto, type CreateAdmissionSessionDto, type CreateAttendanceDto, type CreateCounselingDto, type CreateFaqCategoryDto, type CreateFaqDto, type CreateStaffDto, type CreateStudentDto, type CreateTimetableDto, type UpdateAcademicEventDto, type UpdateAdmissionRegistrationDto, type UpdateAdmissionSessionDto, type UpdateAttendanceDto, type UpdateCounselingDto, type UpdateFaqCategoryDto, type UpdateFaqDto, type UpdateStaffDto, type UpdateStudentDto, type UpdateTimetableDto, academicEventTypeEnum, attendanceStatusEnum, bulkAttendanceSchema, counselingStatusEnum, counselingTypeEnum, createAcademicEventSchema, createAdmissionRegistrationSchema, createAdmissionSessionSchema, createAttendanceSchema, createCounselingSchema, createFaqCategorySchema, createFaqSchema, createStaffSchema, createStudentSchema, createTimetableSchema, registrationStatusEnum, studentStatusEnum, updateAcademicEventSchema, updateAdmissionRegistrationSchema, updateAdmissionSessionSchema, updateAttendanceSchema, updateCounselingSchema, updateFaqCategorySchema, updateFaqSchema, updateStaffSchema, updateStudentSchema, updateTimetableSchema };
