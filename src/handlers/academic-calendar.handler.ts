import { AcademicCalendarService } from '../services/academic-calendar.service';
import { createTimetableSchema, updateTimetableSchema, createAcademicEventSchema, updateAcademicEventSchema } from '../validators/academic-calendar.validator';
import { NextApiResponse } from '../utils/api-response';

export function createAcademicCalendarHandlers(service: AcademicCalendarService, withAdminApi: (handler: Function) => Function) {
  const timetableList = {
    GET: withAdminApi(async (req: Request) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get('page')) || 1;
      const limit = Number(url.searchParams.get('limit')) || 20;
      const sortBy = url.searchParams.get('sortBy') || undefined;
      const year = url.searchParams.get('year') ? Number(url.searchParams.get('year')) : undefined;
      const semester = url.searchParams.get('semester') ? Number(url.searchParams.get('semester')) : undefined;
      const schoolLevel = url.searchParams.get('schoolLevel') || undefined;

      const result = await service.listTimetables({ page, limit, sortBy, year, semester, schoolLevel });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req: Request) => {
      const body = await req.json();
      const data = createTimetableSchema.parse(body);
      const created = await service.createTimetable(data);
      return NextApiResponse.created(created);
    }),
  };

  const timetableDetail = {
    GET: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      const item = await service.getTimetableById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      const body = await req.json();
      const data = updateTimetableSchema.parse(body);
      const updated = await service.updateTimetable(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      await service.deleteTimetable(ctx.params.id);
      return NextApiResponse.noContent();
    }),
  };

  const eventList = {
    GET: withAdminApi(async (req: Request) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get('page')) || 1;
      const limit = Number(url.searchParams.get('limit')) || 20;
      const sortBy = url.searchParams.get('sortBy') || undefined;
      const type = url.searchParams.get('type') || undefined;
      const schoolLevel = url.searchParams.get('schoolLevel') || undefined;

      const result = await service.listEvents({ page, limit, sortBy, type, schoolLevel });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req: Request) => {
      const body = await req.json();
      const data = createAcademicEventSchema.parse(body);
      const created = await service.createEvent(data);
      return NextApiResponse.created(created);
    }),
  };

  const eventDetail = {
    GET: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      const item = await service.getEventById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      const body = await req.json();
      const data = updateAcademicEventSchema.parse(body);
      const updated = await service.updateEvent(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      await service.deleteEvent(ctx.params.id);
      return NextApiResponse.noContent();
    }),
  };

  return {
    list: timetableList,
    detail: timetableDetail,
    eventList,
    eventDetail,
  };
}
