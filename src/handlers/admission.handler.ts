import { AdmissionService } from '../services/admission.service';
import { createAdmissionSessionSchema, updateAdmissionSessionSchema } from '../validators/admission.validator';
import { NextApiResponse } from '../utils/api-response';
import { guard, listQuerySchema, parseQuery, resolveParam, type AdminApiWrapper } from './route';

export function createAdmissionHandlers(service: AdmissionService, withAdminApi: AdminApiWrapper) {
  const list = {
    GET: withAdminApi(guard(async (req) => {
      const result = await service.listSessions(parseQuery(req, listQuerySchema));
      return NextApiResponse.success(result);
    })),
    POST: withAdminApi(guard(async (req) => {
      const data = createAdmissionSessionSchema.parse(await req.json());
      const created = await service.createSession(data);
      return NextApiResponse.created(created);
    })),
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
    })),
  };

  return { list, detail };
}
