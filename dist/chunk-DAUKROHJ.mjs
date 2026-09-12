import {
  NextApiResponse
} from "./chunk-4AHS2SIY.mjs";
import {
  academicEventTypeEnum,
  attendanceStatusEnum,
  counselingStatusEnum,
  counselingTypeEnum,
  createAcademicEventSchema,
  createAdmissionSessionSchema,
  createAttendanceSchema,
  createCounselingSchema,
  createFaqSchema,
  createStaffSchema,
  createStudentSchema,
  createTimetableSchema,
  studentStatusEnum,
  updateAcademicEventSchema,
  updateAdmissionSessionSchema,
  updateAttendanceSchema,
  updateCounselingSchema,
  updateFaqSchema,
  updateStaffSchema,
  updateStudentSchema,
  updateTimetableSchema
} from "./chunk-T3WKWIOX.mjs";
import {
  AcademicAffairsError
} from "./chunk-QIK4YES6.mjs";
import {
  AcademicCalendarService,
  AdmissionService,
  AttendanceService,
  CounselingService,
  FaqService,
  StaffService,
  StudentService
} from "./chunk-ACPRHA5C.mjs";

// src/handlers/staff.handler.ts
import { z as z2 } from "zod";

// src/handlers/route.ts
import { z, ZodError } from "zod";
var MAX_LIST_LIMIT = 200;
var DEFAULT_LIST_LIMIT = 20;
var listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_LIST_LIMIT).default(DEFAULT_LIST_LIMIT),
  sortBy: z.string().max(64).optional()
});
function queryObject(url) {
  const out = {};
  url.searchParams.forEach((value, key) => {
    if (value !== "") out[key] = value;
  });
  return out;
}
function parseQuery(req, schema) {
  return schema.parse(queryObject(new URL(req.url)));
}
async function resolveParam(props, key = "id") {
  const params = await props?.params;
  const value = params?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}
function guard(handler) {
  return async (req, actor, props) => {
    try {
      return await handler(req, actor, props);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextApiResponse.error("\uC785\uB825\uAC12\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4", 400, "VALIDATION");
      }
      if (err instanceof AcademicAffairsError) {
        return NextApiResponse.error(err.message, err.httpStatus, err.code);
      }
      if (isPrismaNotFound(err)) {
        return NextApiResponse.notFound();
      }
      throw err;
    }
  };
}
function isPrismaNotFound(err) {
  return typeof err === "object" && err !== null && err.code === "P2025";
}
function adaptContextWrapper(wrap, resolveActor) {
  return (handler) => {
    const wrapped = wrap(async (ctx, props) => {
      if (!ctx.user) return NextApiResponse.unauthorized("\uC778\uC99D\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
      const actor = await resolveActor(ctx.user, ctx.request);
      if (!actor || !actor.permissions.length && actor.role?.isSystem !== true) {
        return NextApiResponse.forbidden("\uC5ED\uD560\uC774 \uD560\uB2F9\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4");
      }
      return handler(ctx.request, actor, props);
    });
    return (req, props) => wrapped(req, props);
  };
}

// src/handlers/staff.handler.ts
var listQuery = listQuerySchema.extend({
  role: z2.string().max(64).optional()
});
function createStaffHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createStaffSchema.parse(await req.json());
      const created = await service.create(data);
      return NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const data = updateStaffSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      await service.delete(id);
      return NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/academic-calendar.handler.ts
import { z as z3 } from "zod";
var timetableQuery = listQuerySchema.extend({
  year: z3.coerce.number().int().min(2e3).max(2100).optional(),
  semester: z3.coerce.number().int().min(1).max(2).optional(),
  schoolLevel: z3.string().max(32).optional()
});
var eventQuery = listQuerySchema.extend({
  type: academicEventTypeEnum.optional(),
  schoolLevel: z3.string().max(32).optional()
});
function createAcademicCalendarHandlers(service, withAdminApi) {
  const timetableList = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.listTimetables(parseQuery(req, timetableQuery));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createTimetableSchema.parse(await req.json());
      const created = await service.createTimetable(data);
      return NextApiResponse.created(created);
    }))
  };
  const timetableDetail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const item = await service.getTimetableById(id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const data = updateTimetableSchema.parse(await req.json());
      const updated = await service.updateTimetable(id, data);
      return NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      await service.deleteTimetable(id);
      return NextApiResponse.noContent();
    }))
  };
  const eventList = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.listEvents(parseQuery(req, eventQuery));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createAcademicEventSchema.parse(await req.json());
      const created = await service.createEvent(data);
      return NextApiResponse.created(created);
    }))
  };
  const eventDetail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const item = await service.getEventById(id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const data = updateAcademicEventSchema.parse(await req.json());
      const updated = await service.updateEvent(id, data);
      return NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      await service.deleteEvent(id);
      return NextApiResponse.noContent();
    }))
  };
  return {
    list: timetableList,
    detail: timetableDetail,
    eventList,
    eventDetail
  };
}

// src/handlers/faq.handler.ts
import { z as z4 } from "zod";
var listQuery2 = listQuerySchema.extend({
  categoryId: z4.string().max(64).optional()
});
function createFaqHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery2));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createFaqSchema.parse(await req.json());
      const created = await service.create(data);
      return NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const data = updateFaqSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      await service.delete(id);
      return NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/student.handler.ts
import { z as z5 } from "zod";
var listQuery3 = listQuerySchema.extend({
  grade: z5.coerce.number().int().min(1).optional(),
  status: studentStatusEnum.optional(),
  classGroup: z5.string().max(64).optional()
});
function createStudentHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery3));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createStudentSchema.parse(await req.json());
      const created = await service.create(data);
      return NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const data = updateStudentSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      await service.delete(id);
      return NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/attendance.handler.ts
import { z as z6 } from "zod";
var listQuery4 = listQuerySchema.extend({
  studentId: z6.string().max(64).optional(),
  status: attendanceStatusEnum.optional()
});
function createAttendanceHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery4));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createAttendanceSchema.parse(await req.json());
      const created = await service.create(data);
      return NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const data = updateAttendanceSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      await service.delete(id);
      return NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/counseling.handler.ts
import { z as z7 } from "zod";
var listQuery5 = listQuerySchema.extend({
  studentId: z7.string().max(64).optional(),
  type: counselingTypeEnum.optional(),
  status: counselingStatusEnum.optional()
});
function createCounselingHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery5));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req, actor) => {
      const data = createCounselingSchema.parse(await req.json());
      const counselorId = data.counselorId ?? actor.staffId;
      const created = await service.create({ ...data, counselorId });
      return NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const data = updateCounselingSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      await service.delete(id);
      return NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/admission.handler.ts
function createAdmissionHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.listSessions(parseQuery(req, listQuerySchema));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createAdmissionSessionSchema.parse(await req.json());
      const created = await service.createSession(data);
      return NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const item = await service.getSessionById(id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      const data = updateAdmissionSessionSchema.parse(await req.json());
      const updated = await service.updateSession(id, data);
      return NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return NextApiResponse.notFound();
      await service.deleteSession(id);
      return NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/dashboard.handler.ts
function createDashboardHandlers(services, withAdminApi) {
  const stats = {
    GET: withAdminApi(guard(async () => {
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
    }))
  };
  return { stats };
}

// src/handlers/create-system.ts
function createAcademicSystem(config) {
  const services = {};
  const handlers = {};
  const withAdminApi = config.withAdminApi;
  if (typeof withAdminApi !== "function") {
    throw new AcademicAffairsError(
      "VALIDATION",
      "createAcademicSystem requires `withAdminApi`; handlers are never exposed without an auth wrapper",
      500
    );
  }
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
  MAX_LIST_LIMIT,
  DEFAULT_LIST_LIMIT,
  listQuerySchema,
  queryObject,
  parseQuery,
  resolveParam,
  guard,
  adaptContextWrapper,
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
//# sourceMappingURL=chunk-DAUKROHJ.mjs.map