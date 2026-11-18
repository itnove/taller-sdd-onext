import type { FastifyPluginCallback } from 'fastify';
import { idParamsSchema, type IdParams } from '../../http/validation.ts';
import { checkInResponseSchema, membersResponseSchema, streakResponseSchema } from './schemas.ts';
import type { AttendanceService } from './service.ts';

export interface AttendanceRoutesOptions {
  service: AttendanceService;
}

/** Rutas del módulo asistencia bajo `/api/members`. Sin SQL ni reglas: solo HTTP y JSON Schema (DEC-08). */
export const attendanceRoutes: FastifyPluginCallback<AttendanceRoutesOptions> = (
  app,
  { service },
  done,
) => {
  app.get('/', { schema: { response: { 200: membersResponseSchema } } }, () => ({
    members: service.listMembers(),
  }));

  app.post<{ Params: IdParams }>(
    '/:id/checkins',
    { schema: { params: idParamsSchema, response: { 200: checkInResponseSchema } } },
    (request) => service.checkIn(Number(request.params.id)),
  );

  app.get<{ Params: IdParams }>(
    '/:id/streak',
    { schema: { params: idParamsSchema, response: { 200: streakResponseSchema } } },
    (request) => service.getStreak(Number(request.params.id)),
  );

  done();
};
