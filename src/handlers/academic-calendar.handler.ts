import { z } from 'zod';
import { AcademicCalendarService } from '../services/academic-calendar.service';
import {
  createTimetableSchema,
  updateTimetableSchema,
  createAcademicEventSchema,
  updateAcademicEventSchema,
  academicEventTypeEnum,
} from '../validators/academic-calendar.validator';
import { NextApiResponse } from '../utils/api-response';
import { guard, listQuerySchema, parseQuery, resolveParam, type AdminApiWrapper } from './route';

const timetableQuery = listQuerySchema.extend({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  semester: z.coerce.number().int().min(1).max(2).optional(),
  schoolLevel: z.string().max(32).optional(),
});

const eventQuery = listQuerySchema.extend({
  type: academicEventTypeEnum.optional(),
  schoolLevel: z.string().max(32).optional(),
});

export function createAcademicCalendarHandlers(service: AcademicCalendarService, withAdminApi: AdminApiWrapper) {
  const timetableList = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.listTimetables(parseQuery(req, timetableQuery));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createTimetableSchema.parse(await req.json());
      const created = await service.createTimetable(data);
      return NextApiResponse.created(created);
    })),
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
    })),
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
    })),
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
    })),
  };

  return {
    list: timetableList,
    detail: timetableDetail,
    eventList,
    eventDetail,
  };
}
