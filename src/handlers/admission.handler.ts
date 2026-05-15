import { AdmissionService } from '../services/admission.service';
import { createAdmissionSessionSchema, updateAdmissionSessionSchema, createAdmissionRegistrationSchema } from '../validators/admission.validator';
import { NextApiResponse } from '../utils/api-response';

export function createAdmissionHandlers(service: AdmissionService, withAdminApi: (handler: Function) => Function) {
  const list = {
    GET: withAdminApi(async (req: Request) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get('page')) || 1;
      const limit = Number(url.searchParams.get('limit')) || 20;
      const sortBy = url.searchParams.get('sortBy') || undefined;

      const result = await service.listSessions({ page, limit, sortBy });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req: Request) => {
      const body = await req.json();
      const data = createAdmissionSessionSchema.parse(body);
      const created = await service.createSession(data);
      return NextApiResponse.created(created);
    }),
  };

  const detail = {
    GET: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      const item = await service.getSessionById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      const body = await req.json();
      const data = updateAdmissionSessionSchema.parse(body);
      const updated = await service.updateSession(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      await service.deleteSession(ctx.params.id);
      return NextApiResponse.noContent();
    }),
  };

  return { list, detail };
}
