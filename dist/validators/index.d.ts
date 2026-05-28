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
}, z.core.$strip>;
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
}, z.core.$strip>;
type CreateStaffDto = z.infer<typeof createStaffSchema>;
type UpdateStaffDto = z.infer<typeof updateStaffSchema>;

declare const academicEventTypeEnum: z.ZodEnum<{
    SEMESTER_START: "SEMESTER_START";
    SEMESTER_END: "SEMESTER_END";
    EXAM: "EXAM";
    VACATION: "VACATION";
    HOLIDAY: "HOLIDAY";
    EVENT: "EVENT";
    FIELD_TRIP: "FIELD_TRIP";
    PARENT_MEETING: "PARENT_MEETING";
    OTHER: "OTHER";
}>;
declare const createTimetableSchema: z.ZodObject<{
    title: z.ZodString;
    year: z.ZodNumber;
    semester: z.ZodNumber;
    schoolLevel: z.ZodString;
    fileUrl: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const updateTimetableSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodNumber>;
    semester: z.ZodOptional<z.ZodNumber>;
    schoolLevel: z.ZodOptional<z.ZodString>;
    fileUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    content: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
declare const createAcademicEventSchema: z.ZodObject<{
    title: z.ZodString;
    startDate: z.ZodCoercedDate<unknown>;
    endDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    type: z.ZodEnum<{
        SEMESTER_START: "SEMESTER_START";
        SEMESTER_END: "SEMESTER_END";
        EXAM: "EXAM";
        VACATION: "VACATION";
        HOLIDAY: "HOLIDAY";
        EVENT: "EVENT";
        FIELD_TRIP: "FIELD_TRIP";
        PARENT_MEETING: "PARENT_MEETING";
        OTHER: "OTHER";
    }>;
    schoolLevel: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    isAllDay: z.ZodDefault<z.ZodBoolean>;
    color: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const updateAcademicEventSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    type: z.ZodOptional<z.ZodEnum<{
        SEMESTER_START: "SEMESTER_START";
        SEMESTER_END: "SEMESTER_END";
        EXAM: "EXAM";
        VACATION: "VACATION";
        HOLIDAY: "HOLIDAY";
        EVENT: "EVENT";
        FIELD_TRIP: "FIELD_TRIP";
        PARENT_MEETING: "PARENT_MEETING";
        OTHER: "OTHER";
    }>>;
    schoolLevel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isAllDay: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isPublished: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
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
}, z.core.$strip>;
declare const updateFaqSchema: z.ZodObject<{
    question: z.ZodOptional<z.ZodString>;
    answer: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isPublished: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
declare const createFaqCategorySchema: z.ZodObject<{
    name: z.ZodString;
    order: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
declare const updateFaqCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
type CreateFaqDto = z.infer<typeof createFaqSchema>;
type UpdateFaqDto = z.infer<typeof updateFaqSchema>;
type CreateFaqCategoryDto = z.infer<typeof createFaqCategorySchema>;
type UpdateFaqCategoryDto = z.infer<typeof updateFaqCategorySchema>;

declare const studentStatusEnum: z.ZodEnum<{
    ACTIVE: "ACTIVE";
    ON_LEAVE: "ON_LEAVE";
    GRADUATED: "GRADUATED";
    WITHDRAWN: "WITHDRAWN";
}>;
declare const createStudentSchema: z.ZodObject<{
    name: z.ZodString;
    grade: z.ZodNumber;
    classGroup: z.ZodOptional<z.ZodString>;
    birthDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    phone: z.ZodOptional<z.ZodString>;
    parentPhone: z.ZodOptional<z.ZodString>;
    parentName: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        ON_LEAVE: "ON_LEAVE";
        GRADUATED: "GRADUATED";
        WITHDRAWN: "WITHDRAWN";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const updateStudentSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    grade: z.ZodOptional<z.ZodNumber>;
    classGroup: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    birthDate: z.ZodOptional<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        ON_LEAVE: "ON_LEAVE";
        GRADUATED: "GRADUATED";
        WITHDRAWN: "WITHDRAWN";
    }>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
type CreateStudentDto = z.infer<typeof createStudentSchema>;
type UpdateStudentDto = z.infer<typeof updateStudentSchema>;

declare const attendanceStatusEnum: z.ZodEnum<{
    PRESENT: "PRESENT";
    ABSENT: "ABSENT";
    LATE: "LATE";
    EARLY_LEAVE: "EARLY_LEAVE";
    EXCUSED: "EXCUSED";
}>;
declare const createAttendanceSchema: z.ZodObject<{
    studentId: z.ZodString;
    date: z.ZodCoercedDate<unknown>;
    status: z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        LATE: "LATE";
        EARLY_LEAVE: "EARLY_LEAVE";
        EXCUSED: "EXCUSED";
    }>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const updateAttendanceSchema: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    status: z.ZodOptional<z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        LATE: "LATE";
        EARLY_LEAVE: "EARLY_LEAVE";
        EXCUSED: "EXCUSED";
    }>>;
    reason: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
declare const bulkAttendanceSchema: z.ZodObject<{
    records: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        date: z.ZodCoercedDate<unknown>;
        status: z.ZodEnum<{
            PRESENT: "PRESENT";
            ABSENT: "ABSENT";
            LATE: "LATE";
            EARLY_LEAVE: "EARLY_LEAVE";
            EXCUSED: "EXCUSED";
        }>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type CreateAttendanceDto = z.infer<typeof createAttendanceSchema>;
type UpdateAttendanceDto = z.infer<typeof updateAttendanceSchema>;
type BulkAttendanceDto = z.infer<typeof bulkAttendanceSchema>;

declare const counselingTypeEnum: z.ZodEnum<{
    INITIAL: "INITIAL";
    REGULAR: "REGULAR";
    EMERGENCY: "EMERGENCY";
    PARENT: "PARENT";
    ADMISSION: "ADMISSION";
}>;
declare const counselingStatusEnum: z.ZodEnum<{
    SCHEDULED: "SCHEDULED";
    COMPLETED: "COMPLETED";
    CANCELLED: "CANCELLED";
    NO_SHOW: "NO_SHOW";
}>;
declare const createCounselingSchema: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodString>;
    counselorId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        INITIAL: "INITIAL";
        REGULAR: "REGULAR";
        EMERGENCY: "EMERGENCY";
        PARENT: "PARENT";
        ADMISSION: "ADMISSION";
    }>;
    date: z.ZodCoercedDate<unknown>;
    title: z.ZodString;
    content: z.ZodString;
    parentName: z.ZodOptional<z.ZodString>;
    parentPhone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        SCHEDULED: "SCHEDULED";
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        NO_SHOW: "NO_SHOW";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const updateCounselingSchema: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    counselorId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodEnum<{
        INITIAL: "INITIAL";
        REGULAR: "REGULAR";
        EMERGENCY: "EMERGENCY";
        PARENT: "PARENT";
        ADMISSION: "ADMISSION";
    }>>;
    date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    parentName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        SCHEDULED: "SCHEDULED";
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        NO_SHOW: "NO_SHOW";
    }>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
type CreateCounselingDto = z.infer<typeof createCounselingSchema>;
type UpdateCounselingDto = z.infer<typeof updateCounselingSchema>;

declare const registrationStatusEnum: z.ZodEnum<{
    CANCELLED: "CANCELLED";
    PENDING: "PENDING";
    CONFIRMED: "CONFIRMED";
    ATTENDED: "ATTENDED";
}>;
declare const createAdmissionSessionSchema: z.ZodObject<{
    title: z.ZodString;
    date: z.ZodCoercedDate<unknown>;
    location: z.ZodOptional<z.ZodString>;
    capacity: z.ZodDefault<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    isOpen: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const updateAdmissionSessionSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    capacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isOpen: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
declare const createAdmissionRegistrationSchema: z.ZodObject<{
    sessionId: z.ZodString;
    applicantName: z.ZodString;
    phone: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    studentName: z.ZodString;
    studentGrade: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        PENDING: "PENDING";
        CONFIRMED: "CONFIRMED";
        ATTENDED: "ATTENDED";
    }>>;
}, z.core.$strip>;
declare const updateAdmissionRegistrationSchema: z.ZodObject<{
    sessionId: z.ZodOptional<z.ZodString>;
    applicantName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    studentName: z.ZodOptional<z.ZodString>;
    studentGrade: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    message: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        PENDING: "PENDING";
        CONFIRMED: "CONFIRMED";
        ATTENDED: "ATTENDED";
    }>>>;
}, z.core.$strip>;
type CreateAdmissionSessionDto = z.infer<typeof createAdmissionSessionSchema>;
type UpdateAdmissionSessionDto = z.infer<typeof updateAdmissionSessionSchema>;
type CreateAdmissionRegistrationDto = z.infer<typeof createAdmissionRegistrationSchema>;
type UpdateAdmissionRegistrationDto = z.infer<typeof updateAdmissionRegistrationSchema>;

export { type BulkAttendanceDto, type CreateAcademicEventDto, type CreateAdmissionRegistrationDto, type CreateAdmissionSessionDto, type CreateAttendanceDto, type CreateCounselingDto, type CreateFaqCategoryDto, type CreateFaqDto, type CreateStaffDto, type CreateStudentDto, type CreateTimetableDto, type UpdateAcademicEventDto, type UpdateAdmissionRegistrationDto, type UpdateAdmissionSessionDto, type UpdateAttendanceDto, type UpdateCounselingDto, type UpdateFaqCategoryDto, type UpdateFaqDto, type UpdateStaffDto, type UpdateStudentDto, type UpdateTimetableDto, academicEventTypeEnum, attendanceStatusEnum, bulkAttendanceSchema, counselingStatusEnum, counselingTypeEnum, createAcademicEventSchema, createAdmissionRegistrationSchema, createAdmissionSessionSchema, createAttendanceSchema, createCounselingSchema, createFaqCategorySchema, createFaqSchema, createStaffSchema, createStudentSchema, createTimetableSchema, registrationStatusEnum, studentStatusEnum, updateAcademicEventSchema, updateAdmissionRegistrationSchema, updateAdmissionSessionSchema, updateAttendanceSchema, updateCounselingSchema, updateFaqCategorySchema, updateFaqSchema, updateStaffSchema, updateStudentSchema, updateTimetableSchema };
