import type { FastifyPluginCallback } from 'fastify';
import { idParamsSchema, type IdParams } from '../../http/validation.ts';
import type { FreezeService } from './freeze-service.ts';
import {
  freezeBodySchema,
  freezeListSchema,
  freezeResultSchema,
  type FreezeBody,
} from './schemas.ts';

export interface FreezeRoutesOptions {
  service: FreezeService;
}

/** Rutas de congelación bajo `/api/members/:id/freezes` (HU-02). Solo HTTP y JSON Schema (DEC-08). */
export const freezeRoutes: FastifyPluginCallback<FreezeRoutesOptions> = (
  app,
  { service },
  done,
) => {
  app.get<{ Params: IdParams }>(
    '/:id/freezes',
    { schema: { params: idParamsSchema, response: { 200: freezeListSchema } } },
    (request) => service.list(Number(request.params.id)),
  );

  app.post<{ Params: IdParams; Body: FreezeBody }>(
    '/:id/freezes',
    {
      schema: {
        params: idParamsSchema,
        body: freezeBodySchema,
        response: { 201: freezeResultSchema },
      },
    },
    (request, reply) => {
      const { start, end } = request.body;
      return reply.code(201).send(service.create(Number(request.params.id), { start, end }));
    },
  );

  done();
};
