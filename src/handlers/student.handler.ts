import { z } from 'zod';
import { StudentService } from '../services/student.service';
import { createStudentSchema, updateStudentSchema, studentStatusEnum } from '../validators/student.validator';
import { NextApiResponse } from '../utils/api-response';
import { guard, listQuerySchema, parseQuery, resolveParam, type AdminApiWrapper } from './route';

const listQuery = listQuerySchema.extend({
  grade: z.coerce.number().int().min(1).optional(),
  status: studentStatusEnum.optional(),
  classGroup: z.string().max(64).optional(),
});

export function createStudentHandlers(service: StudentService, withAdminApi: AdminApiWrapper) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createStudentSchema.parse(await req.json());
      const created = await service.create(data);
      return NextApiResponse.created(created);
    })),
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
    })),
  };

  return { list, detail };
}
