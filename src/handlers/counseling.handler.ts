import { z } from 'zod';
import { CounselingService } from '../services/counseling.service';
import {
  createCounselingSchema,
  updateCounselingSchema,
  counselingTypeEnum,
  counselingStatusEnum,
} from '../validators/counseling.validator';
import { NextApiResponse } from '../utils/api-response';
import { guard, listQuerySchema, parseQuery, resolveParam, type AdminApiWrapper } from './route';

const listQuery = listQuerySchema.extend({
  studentId: z.string().max(64).optional(),
  type: counselingTypeEnum.optional(),
  status: counselingStatusEnum.optional(),
});

export function createCounselingHandlers(service: CounselingService, withAdminApi: AdminApiWrapper) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.list(parseQuery(req, listQuery));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req, actor) => {
      const data = createCounselingSchema.parse(await req.json());
      // The counselor defaults to the acting staff member; explicit assignment stays possible.
      const counselorId = data.counselorId ?? actor.staffId;
      const created = await service.create({ ...data, counselorId });
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
      const data = updateCounselingSchema.parse(await req.json());
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
