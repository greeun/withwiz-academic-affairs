import {
  NextApiResponse
} from "./chunk-4AHS2SIY.mjs";
import {
  createAcademicEventSchema,
  createAdmissionSessionSchema,
  createAttendanceSchema,
  createCounselingSchema,
  createFaqSchema,
  createStaffSchema,
  createStudentSchema,
  createTimetableSchema,
  updateAcademicEventSchema,
  updateAdmissionSessionSchema,
  updateAttendanceSchema,
  updateCounselingSchema,
  updateFaqSchema,
  updateStaffSchema,
  updateStudentSchema,
  updateTimetableSchema
} from "./chunk-PDPSZ56T.mjs";
import {
  AcademicCalendarService,
  AdmissionService,
  AttendanceService,
  CounselingService,
  FaqService,
  StaffService,
  StudentService
} from "./chunk-LJFJUE4W.mjs";

// src/handlers/staff.handler.ts
function createStaffHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(async (req) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const sortBy = url.searchParams.get("sortBy") || void 0;
      const role = url.searchParams.get("role") || void 0;
      const result = await service.list({ page, limit, sortBy, role });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req) => {
      const body = await req.json();
      const data = createStaffSchema.parse(body);
      const created = await service.create(data);
      return NextApiResponse.created(created);
    })
  };
  const detail = {
    GET: withAdminApi(async (req, ctx) => {
      const item = await service.getById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req, ctx) => {
      const body = await req.json();
      const data = updateStaffSchema.parse(body);
      const updated = await service.update(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req, ctx) => {
      await service.delete(ctx.params.id);
      return NextApiResponse.noContent();
    })
  };
  return { list, detail };
}

// src/handlers/academic-calendar.handler.ts
function createAcademicCalendarHandlers(service, withAdminApi) {
  const timetableList = {
    GET: withAdminApi(async (req) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const sortBy = url.searchParams.get("sortBy") || void 0;
      const year = url.searchParams.get("year") ? Number(url.searchParams.get("year")) : void 0;
      const semester = url.searchParams.get("semester") ? Number(url.searchParams.get("semester")) : void 0;
      const schoolLevel = url.searchParams.get("schoolLevel") || void 0;
      const result = await service.listTimetables({ page, limit, sortBy, year, semester, schoolLevel });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req) => {
      const body = await req.json();
      const data = createTimetableSchema.parse(body);
      const created = await service.createTimetable(data);
      return NextApiResponse.created(created);
    })
  };
  const timetableDetail = {
    GET: withAdminApi(async (req, ctx) => {
      const item = await service.getTimetableById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req, ctx) => {
      const body = await req.json();
      const data = updateTimetableSchema.parse(body);
      const updated = await service.updateTimetable(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req, ctx) => {
      await service.deleteTimetable(ctx.params.id);
      return NextApiResponse.noContent();
    })
  };
  const eventList = {
    GET: withAdminApi(async (req) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const sortBy = url.searchParams.get("sortBy") || void 0;
      const type = url.searchParams.get("type") || void 0;
      const schoolLevel = url.searchParams.get("schoolLevel") || void 0;
      const result = await service.listEvents({ page, limit, sortBy, type, schoolLevel });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req) => {
      const body = await req.json();
      const data = createAcademicEventSchema.parse(body);
      const created = await service.createEvent(data);
      return NextApiResponse.created(created);
    })
  };
  const eventDetail = {
    GET: withAdminApi(async (req, ctx) => {
      const item = await service.getEventById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req, ctx) => {
      const body = await req.json();
      const data = updateAcademicEventSchema.parse(body);
      const updated = await service.updateEvent(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req, ctx) => {
      await service.deleteEvent(ctx.params.id);
      return NextApiResponse.noContent();
    })
  };
  return {
    list: timetableList,
    detail: timetableDetail,
    eventList,
    eventDetail
  };
}

// src/handlers/faq.handler.ts
function createFaqHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(async (req) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const sortBy = url.searchParams.get("sortBy") || void 0;
      const categoryId = url.searchParams.get("categoryId") || void 0;
      const result = await service.list({ page, limit, sortBy, categoryId });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req) => {
      const body = await req.json();
      const data = createFaqSchema.parse(body);
      const created = await service.create(data);
      return NextApiResponse.created(created);
    })
  };
  const detail = {
    GET: withAdminApi(async (req, ctx) => {
      const item = await service.getById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req, ctx) => {
      const body = await req.json();
      const data = updateFaqSchema.parse(body);
      const updated = await service.update(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req, ctx) => {
      await service.delete(ctx.params.id);
      return NextApiResponse.noContent();
    })
  };
  return { list, detail };
}

// src/handlers/student.handler.ts
function createStudentHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(async (req) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const sortBy = url.searchParams.get("sortBy") || void 0;
      const grade = url.searchParams.get("grade") ? Number(url.searchParams.get("grade")) : void 0;
      const status = url.searchParams.get("status") || void 0;
      const result = await service.list({ page, limit, sortBy, grade, status });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req) => {
      const body = await req.json();
      const data = createStudentSchema.parse(body);
      const created = await service.create(data);
      return NextApiResponse.created(created);
    })
  };
  const detail = {
    GET: withAdminApi(async (req, ctx) => {
      const item = await service.getById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req, ctx) => {
      const body = await req.json();
      const data = updateStudentSchema.parse(body);
      const updated = await service.update(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req, ctx) => {
      await service.delete(ctx.params.id);
      return NextApiResponse.noContent();
    })
  };
  return { list, detail };
}

// src/handlers/attendance.handler.ts
function createAttendanceHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(async (req) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const sortBy = url.searchParams.get("sortBy") || void 0;
      const studentId = url.searchParams.get("studentId") || void 0;
      const status = url.searchParams.get("status") || void 0;
      const result = await service.list({ page, limit, sortBy, studentId, status });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req) => {
      const body = await req.json();
      const data = createAttendanceSchema.parse(body);
      const created = await service.create(data);
      return NextApiResponse.created(created);
    })
  };
  const detail = {
    GET: withAdminApi(async (req, ctx) => {
      const item = await service.getById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req, ctx) => {
      const body = await req.json();
      const data = updateAttendanceSchema.parse(body);
      const updated = await service.update(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req, ctx) => {
      await service.delete(ctx.params.id);
      return NextApiResponse.noContent();
    })
  };
  return { list, detail };
}

// src/handlers/counseling.handler.ts
function createCounselingHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(async (req) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const sortBy = url.searchParams.get("sortBy") || void 0;
      const studentId = url.searchParams.get("studentId") || void 0;
      const type = url.searchParams.get("type") || void 0;
      const status = url.searchParams.get("status") || void 0;
      const result = await service.list({ page, limit, sortBy, studentId, type, status });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req) => {
      const body = await req.json();
      const data = createCounselingSchema.parse(body);
      const created = await service.create(data);
      return NextApiResponse.created(created);
    })
  };
  const detail = {
    GET: withAdminApi(async (req, ctx) => {
      const item = await service.getById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req, ctx) => {
      const body = await req.json();
      const data = updateCounselingSchema.parse(body);
      const updated = await service.update(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req, ctx) => {
      await service.delete(ctx.params.id);
      return NextApiResponse.noContent();
    })
  };
  return { list, detail };
}

// src/handlers/admission.handler.ts
function createAdmissionHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(async (req) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const sortBy = url.searchParams.get("sortBy") || void 0;
      const result = await service.listSessions({ page, limit, sortBy });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req) => {
      const body = await req.json();
      const data = createAdmissionSessionSchema.parse(body);
      const created = await service.createSession(data);
      return NextApiResponse.created(created);
    })
  };
  const detail = {
    GET: withAdminApi(async (req, ctx) => {
      const item = await service.getSessionById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req, ctx) => {
      const body = await req.json();
      const data = updateAdmissionSessionSchema.parse(body);
      const updated = await service.updateSession(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req, ctx) => {
      await service.deleteSession(ctx.params.id);
      return NextApiResponse.noContent();
    })
  };
  return { list, detail };
}

// src/handlers/dashboard.handler.ts
function createDashboardHandlers(services, withAdminApi) {
  const stats = {
    GET: withAdminApi(async () => {
      const results = {};
      const entries = Object.entries(services);
      const statResults = await Promise.all(
        entries.map(async ([key, service]) => {
          try {
            const stat = await service.getStats();
            return [key, stat];
          } catch {
            return [key, null];
          }
        })
      );
      for (const [key, stat] of statResults) {
        if (stat !== null) results[key] = stat;
      }
      return NextApiResponse.success(results);
    })
  };
  return { stats };
}

// src/handlers/create-system.ts
var defaultWithAdminApi = (handler) => handler;
function createAcademicSystem(config) {
  const services = {};
  const handlers = {};
  const withAdminApi = config.withAdminApi ?? defaultWithAdminApi;
  if (config.domains.staff) {
    services.staff = new StaffService(config.prisma);
    handlers.staff = createStaffHandlers(services.staff, withAdminApi);
  }
  if (config.domains.academicCalendar) {
    services.academicCalendar = new AcademicCalendarService(config.prisma);
    handlers.academicCalendar = createAcademicCalendarHandlers(services.academicCalendar, withAdminApi);
  }
  if (config.domains.faq) {
    services.faq = new FaqService(config.prisma);
    handlers.faq = createFaqHandlers(services.faq, withAdminApi);
  }
  if (config.domains.student) {
    services.student = new StudentService(config.prisma);
    handlers.student = createStudentHandlers(services.student, withAdminApi);
  }
  if (config.domains.attendance) {
    services.attendance = new AttendanceService(config.prisma);
    handlers.attendance = createAttendanceHandlers(services.attendance, withAdminApi);
  }
  if (config.domains.counseling) {
    services.counseling = new CounselingService(config.prisma);
    handlers.counseling = createCounselingHandlers(services.counseling, withAdminApi);
  }
  if (config.domains.admission) {
    services.admission = new AdmissionService(config.prisma);
    handlers.admission = createAdmissionHandlers(services.admission, withAdminApi);
  }
  const dashboardServices = {};
  for (const [key, service] of Object.entries(services)) {
    if (service && typeof service.getStats === "function") {
      dashboardServices[key] = service;
    }
  }
  if (Object.keys(dashboardServices).length > 0) {
    handlers.dashboard = createDashboardHandlers(dashboardServices, withAdminApi);
  }
  return { services, handlers };
}

export {
  createStaffHandlers,
  createAcademicCalendarHandlers,
  createFaqHandlers,
  createStudentHandlers,
  createAttendanceHandlers,
  createCounselingHandlers,
  createAdmissionHandlers,
  createDashboardHandlers,
  createAcademicSystem
};
//# sourceMappingURL=chunk-T66RRQC5.mjs.map