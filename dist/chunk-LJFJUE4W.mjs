import {
  buildPaginatedResult
} from "./chunk-5U4CAFCL.mjs";

// src/services/base-service.ts
var DEFAULT_PAGE = 1;
var DEFAULT_LIMIT = 20;
function parseSortParam(sortBy, allowed, defaultField) {
  const [field, order] = sortBy.split("_");
  const safeField = allowed.includes(field) ? field : defaultField;
  const safeOrder = order === "asc" ? "asc" : "desc";
  return { field: safeField, order: safeOrder };
}

// src/services/staff.service.ts
var SORT_ALLOWED = ["createdAt", "name", "sortOrder", "updatedAt"];
var StaffService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  prisma;
  async list(params) {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? "sortOrder_asc", SORT_ALLOWED, "sortOrder");
    const where = {};
    if (params.role) where.role = params.role;
    const [items, total] = await Promise.all([
      this.prisma.staff.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.staff.count({ where })
    ]);
    return buildPaginatedResult(items, total, page, limit);
  }
  async getById(id) {
    return this.prisma.staff.findUnique({ where: { id } });
  }
  async create(data) {
    return this.prisma.staff.create({ data });
  }
  async update(id, data) {
    return this.prisma.staff.update({ where: { id }, data });
  }
  async delete(id) {
    return this.prisma.staff.delete({ where: { id } });
  }
  async getStats() {
    const [total, groups] = await Promise.all([
      this.prisma.staff.count(),
      this.prisma.staff.groupBy({
        by: ["role"],
        _count: { id: true }
      })
    ]);
    const byRole = {};
    for (const g of groups) {
      byRole[g.role] = g._count.id;
    }
    return { total, byRole };
  }
  async reorder(ids) {
    await this.prisma.$transaction(
      (tx) => Promise.all(
        ids.map(
          (id, index) => tx.staff.update({ where: { id }, data: { sortOrder: index } })
        )
      )
    );
  }
};

// src/services/academic-calendar.service.ts
var TIMETABLE_SORT_ALLOWED = ["createdAt", "year", "semester", "updatedAt"];
var EVENT_SORT_ALLOWED = ["createdAt", "startDate", "title", "updatedAt"];
var AcademicCalendarService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  prisma;
  // ── Timetable CRUD ──
  async listTimetables(params) {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? "createdAt_desc", TIMETABLE_SORT_ALLOWED, "createdAt");
    const where = {};
    if (params.year != null) where.year = params.year;
    if (params.semester != null) where.semester = params.semester;
    if (params.schoolLevel) where.schoolLevel = params.schoolLevel;
    const [items, total] = await Promise.all([
      this.prisma.timetable.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.timetable.count({ where })
    ]);
    return buildPaginatedResult(items, total, page, limit);
  }
  async getTimetableById(id) {
    return this.prisma.timetable.findUnique({ where: { id } });
  }
  async createTimetable(data) {
    return this.prisma.timetable.create({ data });
  }
  async updateTimetable(id, data) {
    return this.prisma.timetable.update({ where: { id }, data });
  }
  async deleteTimetable(id) {
    return this.prisma.timetable.delete({ where: { id } });
  }
  async getActiveTimetables() {
    return this.prisma.timetable.findMany({ where: { isActive: true } });
  }
  // ── AcademicEvent CRUD ──
  async listEvents(params) {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? "startDate_asc", EVENT_SORT_ALLOWED, "startDate");
    const where = {};
    if (params.type) where.type = params.type;
    if (params.schoolLevel) where.schoolLevel = params.schoolLevel;
    if (params.isPublished != null) where.isPublished = params.isPublished;
    const [items, total] = await Promise.all([
      this.prisma.academicEvent.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.academicEvent.count({ where })
    ]);
    return buildPaginatedResult(items, total, page, limit);
  }
  async getEventById(id) {
    return this.prisma.academicEvent.findUnique({ where: { id } });
  }
  async createEvent(data) {
    return this.prisma.academicEvent.create({ data });
  }
  async updateEvent(id, data) {
    return this.prisma.academicEvent.update({ where: { id }, data });
  }
  async deleteEvent(id) {
    return this.prisma.academicEvent.delete({ where: { id } });
  }
  async getMonthlyEvents(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    return this.prisma.academicEvent.findMany({
      where: {
        startDate: { gte: startDate, lte: endDate }
      },
      orderBy: { startDate: "asc" }
    });
  }
  async getYearlyEvents(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    return this.prisma.academicEvent.findMany({
      where: {
        startDate: { gte: startDate, lte: endDate }
      },
      orderBy: { startDate: "asc" }
    });
  }
  // ── Stats ──
  async getStats() {
    const [totalTimetables, totalEvents, groups] = await Promise.all([
      this.prisma.timetable.count(),
      this.prisma.academicEvent.count(),
      this.prisma.academicEvent.groupBy({
        by: ["type"],
        _count: { id: true }
      })
    ]);
    const byEventType = {};
    for (const g of groups) {
      byEventType[g.type] = g._count.id;
    }
    return { totalTimetables, totalEvents, byEventType };
  }
};

// src/services/faq.service.ts
var SORT_ALLOWED2 = ["createdAt", "order", "question", "updatedAt"];
var FaqService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  prisma;
  async list(params) {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? "order_asc", SORT_ALLOWED2, "order");
    const where = {};
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.isPublished != null) where.isPublished = params.isPublished;
    const [items, total] = await Promise.all([
      this.prisma.faq.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { category: true }
      }),
      this.prisma.faq.count({ where })
    ]);
    return buildPaginatedResult(items, total, page, limit);
  }
  async getById(id) {
    return this.prisma.faq.findUnique({ where: { id }, include: { category: true } });
  }
  async create(data) {
    return this.prisma.faq.create({ data });
  }
  async update(id, data) {
    return this.prisma.faq.update({ where: { id }, data });
  }
  async delete(id) {
    return this.prisma.faq.delete({ where: { id } });
  }
  async reorder(ids) {
    await this.prisma.$transaction(
      (tx) => Promise.all(
        ids.map(
          (id, index) => tx.faq.update({ where: { id }, data: { order: index } })
        )
      )
    );
  }
  // ── Category methods ──
  async listCategories() {
    return this.prisma.faqCategory.findMany({
      orderBy: { order: "asc" },
      include: { faqs: true }
    });
  }
  async createCategory(data) {
    return this.prisma.faqCategory.create({ data });
  }
  async updateCategory(id, data) {
    return this.prisma.faqCategory.update({ where: { id }, data });
  }
  async deleteCategory(id) {
    return this.prisma.faqCategory.delete({ where: { id } });
  }
  async reorderCategories(ids) {
    await this.prisma.$transaction(
      (tx) => Promise.all(
        ids.map(
          (id, index) => tx.faqCategory.update({ where: { id }, data: { order: index } })
        )
      )
    );
  }
  // ── Stats ──
  async getStats() {
    const [total, groups] = await Promise.all([
      this.prisma.faq.count(),
      this.prisma.faq.groupBy({
        by: ["categoryId"],
        _count: { id: true }
      })
    ]);
    const byCategory = {};
    for (const g of groups) {
      byCategory[g.categoryId ?? "uncategorized"] = g._count.id;
    }
    return { total, byCategory };
  }
};

// src/services/student.service.ts
var SORT_ALLOWED3 = ["createdAt", "name", "grade", "enrolledAt", "updatedAt"];
var StudentService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  prisma;
  async list(params) {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? "name_asc", SORT_ALLOWED3, "name");
    const where = {};
    if (params.grade != null) where.grade = params.grade;
    if (params.status) where.status = params.status;
    if (params.classGroup) where.classGroup = params.classGroup;
    const [items, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.student.count({ where })
    ]);
    return buildPaginatedResult(items, total, page, limit);
  }
  async getById(id) {
    return this.prisma.student.findUnique({ where: { id } });
  }
  async create(data) {
    return this.prisma.student.create({ data });
  }
  async update(id, data) {
    return this.prisma.student.update({ where: { id }, data });
  }
  async delete(id) {
    return this.prisma.student.delete({ where: { id } });
  }
  async getByGrade(grade) {
    return this.prisma.student.findMany({
      where: { grade },
      orderBy: { name: "asc" }
    });
  }
  async updateStatus(id, status) {
    return this.prisma.student.update({
      where: { id },
      data: { status }
    });
  }
  async getStats() {
    const [total, statusGroups, gradeGroups] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.groupBy({
        by: ["status"],
        _count: { id: true }
      }),
      this.prisma.student.groupBy({
        by: ["grade"],
        _count: { id: true }
      })
    ]);
    const byStatus = {};
    for (const g of statusGroups) {
      byStatus[g.status] = g._count.id;
    }
    const byGrade = {};
    for (const g of gradeGroups) {
      byGrade[String(g.grade)] = g._count.id;
    }
    return { total, byStatus, byGrade };
  }
};

// src/services/attendance.service.ts
var SORT_ALLOWED4 = ["createdAt", "date", "status"];
var AttendanceService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  prisma;
  async list(params) {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? "date_desc", SORT_ALLOWED4, "date");
    const where = {};
    if (params.studentId) where.studentId = params.studentId;
    if (params.status) where.status = params.status;
    if (params.date) where.date = params.date;
    const [items, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { student: true }
      }),
      this.prisma.attendance.count({ where })
    ]);
    return buildPaginatedResult(items, total, page, limit);
  }
  async getById(id) {
    return this.prisma.attendance.findUnique({ where: { id }, include: { student: true } });
  }
  async create(data) {
    return this.prisma.attendance.create({ data });
  }
  async update(id, data) {
    return this.prisma.attendance.update({ where: { id }, data });
  }
  async delete(id) {
    return this.prisma.attendance.delete({ where: { id } });
  }
  async bulkCreate(records) {
    return this.prisma.$transaction(
      records.map(
        (record) => this.prisma.attendance.create({ data: record })
      )
    );
  }
  async getDailyReport(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return this.prisma.attendance.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay }
      },
      include: { student: true },
      orderBy: { student: { name: "asc" } }
    });
  }
  async getStudentReport(studentId, startDate, endDate) {
    return this.prisma.attendance.findMany({
      where: {
        studentId,
        date: { gte: startDate, lte: endDate }
      },
      orderBy: { date: "asc" }
    });
  }
  async getStats() {
    const [total, groups] = await Promise.all([
      this.prisma.attendance.count(),
      this.prisma.attendance.groupBy({
        by: ["status"],
        _count: { id: true }
      })
    ]);
    const byStatus = {};
    for (const g of groups) {
      byStatus[g.status] = g._count.id;
    }
    return { total, byStatus };
  }
};

// src/services/counseling.service.ts
var SORT_ALLOWED5 = ["createdAt", "date", "title", "updatedAt"];
var CounselingService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  prisma;
  async list(params) {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? "date_desc", SORT_ALLOWED5, "date");
    const where = {};
    if (params.studentId) where.studentId = params.studentId;
    if (params.type) where.type = params.type;
    if (params.status) where.status = params.status;
    if (params.counselorId) where.counselorId = params.counselorId;
    const [items, total] = await Promise.all([
      this.prisma.counseling.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { student: true }
      }),
      this.prisma.counseling.count({ where })
    ]);
    return buildPaginatedResult(items, total, page, limit);
  }
  async getById(id) {
    return this.prisma.counseling.findUnique({ where: { id }, include: { student: true } });
  }
  async create(data) {
    return this.prisma.counseling.create({ data });
  }
  async update(id, data) {
    return this.prisma.counseling.update({ where: { id }, data });
  }
  async delete(id) {
    return this.prisma.counseling.delete({ where: { id } });
  }
  async getUpcoming() {
    const now = /* @__PURE__ */ new Date();
    return this.prisma.counseling.findMany({
      where: {
        status: "SCHEDULED",
        date: { gte: now }
      },
      include: { student: true },
      orderBy: { date: "asc" }
    });
  }
  async getByStudent(studentId) {
    return this.prisma.counseling.findMany({
      where: { studentId },
      include: { student: true },
      orderBy: { date: "desc" }
    });
  }
  async getStats() {
    const [total, typeGroups, statusGroups] = await Promise.all([
      this.prisma.counseling.count(),
      this.prisma.counseling.groupBy({
        by: ["type"],
        _count: { id: true }
      }),
      this.prisma.counseling.groupBy({
        by: ["status"],
        _count: { id: true }
      })
    ]);
    const byType = {};
    for (const g of typeGroups) {
      byType[g.type] = g._count.id;
    }
    const byStatus = {};
    for (const g of statusGroups) {
      byStatus[g.status] = g._count.id;
    }
    return { total, byType, byStatus };
  }
};

// src/services/admission.service.ts
var SESSION_SORT_ALLOWED = ["createdAt", "date", "title", "updatedAt"];
var REGISTRATION_SORT_ALLOWED = ["createdAt", "applicantName", "updatedAt"];
var AdmissionService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  prisma;
  // ── Session CRUD ──
  async listSessions(params = {}) {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? "date_desc", SESSION_SORT_ALLOWED, "date");
    const where = {};
    if (params.isOpen != null) where.isOpen = params.isOpen;
    const [items, total] = await Promise.all([
      this.prisma.admissionSession.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { registrations: true }
      }),
      this.prisma.admissionSession.count({ where })
    ]);
    return buildPaginatedResult(items, total, page, limit);
  }
  async getSessionById(id) {
    return this.prisma.admissionSession.findUnique({
      where: { id },
      include: { registrations: true }
    });
  }
  async createSession(data) {
    return this.prisma.admissionSession.create({ data });
  }
  async updateSession(id, data) {
    return this.prisma.admissionSession.update({ where: { id }, data });
  }
  async deleteSession(id) {
    return this.prisma.admissionSession.delete({ where: { id } });
  }
  async getOpenSessions() {
    return this.prisma.admissionSession.findMany({
      where: { isOpen: true },
      include: { registrations: true },
      orderBy: { date: "asc" }
    });
  }
  // ── Registration ──
  async listRegistrations(sessionId, params = {}) {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? "createdAt_desc", REGISTRATION_SORT_ALLOWED, "createdAt");
    const where = { sessionId };
    if (params.status) where.status = params.status;
    const [items, total] = await Promise.all([
      this.prisma.admissionRegistration.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.admissionRegistration.count({ where })
    ]);
    return buildPaginatedResult(items, total, page, limit);
  }
  async register(sessionId, data) {
    return this.prisma.admissionRegistration.create({
      data: { ...data, sessionId }
    });
  }
  async updateRegistrationStatus(id, status) {
    return this.prisma.admissionRegistration.update({
      where: { id },
      data: { status }
    });
  }
  // ── Stats ──
  async getStats() {
    const [totalSessions, totalRegistrations, groups] = await Promise.all([
      this.prisma.admissionSession.count(),
      this.prisma.admissionRegistration.count(),
      this.prisma.admissionRegistration.groupBy({
        by: ["status"],
        _count: { id: true }
      })
    ]);
    const byStatus = {};
    for (const g of groups) {
      byStatus[g.status] = g._count.id;
    }
    return { totalSessions, totalRegistrations, byStatus };
  }
};

export {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  parseSortParam,
  StaffService,
  AcademicCalendarService,
  FaqService,
  StudentService,
  AttendanceService,
  CounselingService,
  AdmissionService
};
//# sourceMappingURL=chunk-LJFJUE4W.mjs.map