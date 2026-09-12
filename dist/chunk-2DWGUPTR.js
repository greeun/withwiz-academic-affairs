"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkJDJDGGU2js = require('./chunk-JDJDGGU2.js');






















var _chunkAZY5SARUjs = require('./chunk-AZY5SARU.js');


var _chunkDE323ATWjs = require('./chunk-DE323ATW.js');








var _chunkYVZ72AC6js = require('./chunk-YVZ72AC6.js');

// src/handlers/staff.handler.ts
var _zod = require('zod');

// src/handlers/route.ts

var MAX_LIST_LIMIT = 200;
var DEFAULT_LIST_LIMIT = 20;
var listQuerySchema = _zod.z.object({
  page: _zod.z.coerce.number().int().min(1).default(1),
  limit: _zod.z.coerce.number().int().min(1).max(MAX_LIST_LIMIT).default(DEFAULT_LIST_LIMIT),
  sortBy: _zod.z.string().max(64).optional()
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
  const params = await _optionalChain([props, 'optionalAccess', _ => _.params]);
  const value = _optionalChain([params, 'optionalAccess', _2 => _2[key]]);
  return typeof value === "string" && value.length > 0 ? value : null;
}
function guard(handler) {
  return async (req, actor, props) => {
    try {
      return await handler(req, actor, props);
    } catch (err) {
      if (err instanceof _zod.ZodError) {
        return _chunkJDJDGGU2js.NextApiResponse.error("\uC785\uB825\uAC12\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4", 400, "VALIDATION");
      }
      if (err instanceof _chunkDE323ATWjs.AcademicAffairsError) {
        return _chunkJDJDGGU2js.NextApiResponse.error(err.message, err.httpStatus, err.code);
      }
      if (isPrismaNotFound(err)) {
        return _chunkJDJDGGU2js.NextApiResponse.notFound();
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
      if (!ctx.user) return _chunkJDJDGGU2js.NextApiResponse.unauthorized("\uC778\uC99D\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
      const actor = await resolveActor(ctx.user, ctx.request);
      if (!actor || !actor.permissions.length && _optionalChain([actor, 'access', _3 => _3.role, 'optionalAccess', _4 => _4.isSystem]) !== true) {
        return _chunkJDJDGGU2js.NextApiResponse.forbidden("\uC5ED\uD560\uC774 \uD560\uB2F9\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4");
      }
      return handler(ctx.request, actor, props);
    });
    return (req, props) => wrapped(req, props);
  };
}

// src/handlers/staff.handler.ts
var listQuery = listQuerySchema.extend({
  role: _zod.z.string().max(64).optional()
});
function createStaffHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery));
      return _chunkJDJDGGU2js.NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = _chunkAZY5SARUjs.createStaffSchema.parse(await req.json());
      const created = await service.create(data);
      return _chunkJDJDGGU2js.NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      return _chunkJDJDGGU2js.NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const data = _chunkAZY5SARUjs.updateStaffSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return _chunkJDJDGGU2js.NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      await service.delete(id);
      return _chunkJDJDGGU2js.NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/academic-calendar.handler.ts

var timetableQuery = listQuerySchema.extend({
  year: _zod.z.coerce.number().int().min(2e3).max(2100).optional(),
  semester: _zod.z.coerce.number().int().min(1).max(2).optional(),
  schoolLevel: _zod.z.string().max(32).optional()
});
var eventQuery = listQuerySchema.extend({
  type: _chunkAZY5SARUjs.academicEventTypeEnum.optional(),
  schoolLevel: _zod.z.string().max(32).optional()
});
function createAcademicCalendarHandlers(service, withAdminApi) {
  const timetableList = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.listTimetables(parseQuery(req, timetableQuery));
      return _chunkJDJDGGU2js.NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = _chunkAZY5SARUjs.createTimetableSchema.parse(await req.json());
      const created = await service.createTimetable(data);
      return _chunkJDJDGGU2js.NextApiResponse.created(created);
    }))
  };
  const timetableDetail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const item = await service.getTimetableById(id);
      if (!item) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      return _chunkJDJDGGU2js.NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const data = _chunkAZY5SARUjs.updateTimetableSchema.parse(await req.json());
      const updated = await service.updateTimetable(id, data);
      return _chunkJDJDGGU2js.NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      await service.deleteTimetable(id);
      return _chunkJDJDGGU2js.NextApiResponse.noContent();
    }))
  };
  const eventList = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.listEvents(parseQuery(req, eventQuery));
      return _chunkJDJDGGU2js.NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = _chunkAZY5SARUjs.createAcademicEventSchema.parse(await req.json());
      const created = await service.createEvent(data);
      return _chunkJDJDGGU2js.NextApiResponse.created(created);
    }))
  };
  const eventDetail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const item = await service.getEventById(id);
      if (!item) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      return _chunkJDJDGGU2js.NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const data = _chunkAZY5SARUjs.updateAcademicEventSchema.parse(await req.json());
      const updated = await service.updateEvent(id, data);
      return _chunkJDJDGGU2js.NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      await service.deleteEvent(id);
      return _chunkJDJDGGU2js.NextApiResponse.noContent();
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

var listQuery2 = listQuerySchema.extend({
  categoryId: _zod.z.string().max(64).optional()
});
function createFaqHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery2));
      return _chunkJDJDGGU2js.NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = _chunkAZY5SARUjs.createFaqSchema.parse(await req.json());
      const created = await service.create(data);
      return _chunkJDJDGGU2js.NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      return _chunkJDJDGGU2js.NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const data = _chunkAZY5SARUjs.updateFaqSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return _chunkJDJDGGU2js.NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      await service.delete(id);
      return _chunkJDJDGGU2js.NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/student.handler.ts

var listQuery3 = listQuerySchema.extend({
  grade: _zod.z.coerce.number().int().min(1).optional(),
  status: _chunkAZY5SARUjs.studentStatusEnum.optional(),
  classGroup: _zod.z.string().max(64).optional()
});
function createStudentHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery3));
      return _chunkJDJDGGU2js.NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = _chunkAZY5SARUjs.createStudentSchema.parse(await req.json());
      const created = await service.create(data);
      return _chunkJDJDGGU2js.NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      return _chunkJDJDGGU2js.NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const data = _chunkAZY5SARUjs.updateStudentSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return _chunkJDJDGGU2js.NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      await service.delete(id);
      return _chunkJDJDGGU2js.NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/attendance.handler.ts

var listQuery4 = listQuerySchema.extend({
  studentId: _zod.z.string().max(64).optional(),
  status: _chunkAZY5SARUjs.attendanceStatusEnum.optional()
});
function createAttendanceHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery4));
      return _chunkJDJDGGU2js.NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = _chunkAZY5SARUjs.createAttendanceSchema.parse(await req.json());
      const created = await service.create(data);
      return _chunkJDJDGGU2js.NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      return _chunkJDJDGGU2js.NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const data = _chunkAZY5SARUjs.updateAttendanceSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return _chunkJDJDGGU2js.NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      await service.delete(id);
      return _chunkJDJDGGU2js.NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/counseling.handler.ts

var listQuery5 = listQuerySchema.extend({
  studentId: _zod.z.string().max(64).optional(),
  type: _chunkAZY5SARUjs.counselingTypeEnum.optional(),
  status: _chunkAZY5SARUjs.counselingStatusEnum.optional()
});
function createCounselingHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery5));
      return _chunkJDJDGGU2js.NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req, actor) => {
      const data = _chunkAZY5SARUjs.createCounselingSchema.parse(await req.json());
      const counselorId = _nullishCoalesce(data.counselorId, () => ( actor.staffId));
      const created = await service.create({ ...data, counselorId });
      return _chunkJDJDGGU2js.NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const item = await service.getById(id);
      if (!item) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      return _chunkJDJDGGU2js.NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const data = _chunkAZY5SARUjs.updateCounselingSchema.parse(await req.json());
      const updated = await service.update(id, data);
      return _chunkJDJDGGU2js.NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      await service.delete(id);
      return _chunkJDJDGGU2js.NextApiResponse.noContent();
    }))
  };
  return { list, detail };
}

// src/handlers/admission.handler.ts
function createAdmissionHandlers(service, withAdminApi) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.listSessions(parseQuery(req, listQuerySchema));
      return _chunkJDJDGGU2js.NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = _chunkAZY5SARUjs.createAdmissionSessionSchema.parse(await req.json());
      const created = await service.createSession(data);
      return _chunkJDJDGGU2js.NextApiResponse.created(created);
    }))
  };
  const detail = {
    GET: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const item = await service.getSessionById(id);
      if (!item) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      return _chunkJDJDGGU2js.NextApiResponse.success(item);
    })),
    PUT: withAdminApi(guard(async (req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      const data = _chunkAZY5SARUjs.updateAdmissionSessionSchema.parse(await req.json());
      const updated = await service.updateSession(id, data);
      return _chunkJDJDGGU2js.NextApiResponse.success(updated);
    })),
    DELETE: withAdminApi(guard(async (_req, _actor, props) => {
      const id = await resolveParam(props);
      if (!id) return _chunkJDJDGGU2js.NextApiResponse.notFound();
      await service.deleteSession(id);
      return _chunkJDJDGGU2js.NextApiResponse.noContent();
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
          } catch (e) {
            return [key, null];
          }
        })
      );
      for (const [key, stat] of statResults) {
        if (stat !== null) results[key] = stat;
      }
      return _chunkJDJDGGU2js.NextApiResponse.success(results);
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
    throw new (0, _chunkDE323ATWjs.AcademicAffairsError)(
      "VALIDATION",
      "createAcademicSystem requires `withAdminApi`; handlers are never exposed without an auth wrapper",
      500
    );
  }
  if (config.domains.staff) {
    services.staff = new (0, _chunkYVZ72AC6js.StaffService)(config.prisma);
    handlers.staff = createStaffHandlers(services.staff, withAdminApi);
  }
  if (config.domains.academicCalendar) {
    services.academicCalendar = new (0, _chunkYVZ72AC6js.AcademicCalendarService)(config.prisma);
    handlers.academicCalendar = createAcademicCalendarHandlers(services.academicCalendar, withAdminApi);
  }
  if (config.domains.faq) {
    services.faq = new (0, _chunkYVZ72AC6js.FaqService)(config.prisma);
    handlers.faq = createFaqHandlers(services.faq, withAdminApi);
  }
  if (config.domains.student) {
    services.student = new (0, _chunkYVZ72AC6js.StudentService)(config.prisma);
    handlers.student = createStudentHandlers(services.student, withAdminApi);
  }
  if (config.domains.attendance) {
    services.attendance = new (0, _chunkYVZ72AC6js.AttendanceService)(config.prisma);
    handlers.attendance = createAttendanceHandlers(services.attendance, withAdminApi);
  }
  if (config.domains.counseling) {
    services.counseling = new (0, _chunkYVZ72AC6js.CounselingService)(config.prisma);
    handlers.counseling = createCounselingHandlers(services.counseling, withAdminApi);
  }
  if (config.domains.admission) {
    services.admission = new (0, _chunkYVZ72AC6js.AdmissionService)(config.prisma);
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



















exports.MAX_LIST_LIMIT = MAX_LIST_LIMIT; exports.DEFAULT_LIST_LIMIT = DEFAULT_LIST_LIMIT; exports.listQuerySchema = listQuerySchema; exports.queryObject = queryObject; exports.parseQuery = parseQuery; exports.resolveParam = resolveParam; exports.guard = guard; exports.adaptContextWrapper = adaptContextWrapper; exports.createStaffHandlers = createStaffHandlers; exports.createAcademicCalendarHandlers = createAcademicCalendarHandlers; exports.createFaqHandlers = createFaqHandlers; exports.createStudentHandlers = createStudentHandlers; exports.createAttendanceHandlers = createAttendanceHandlers; exports.createCounselingHandlers = createCounselingHandlers; exports.createAdmissionHandlers = createAdmissionHandlers; exports.createDashboardHandlers = createDashboardHandlers; exports.createAcademicSystem = createAcademicSystem;
//# sourceMappingURL=chunk-2DWGUPTR.js.map