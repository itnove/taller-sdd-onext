import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import type { DatabaseSync } from 'node:sqlite';
import { systemClock, type Clock } from './clock.ts';
import { withTransaction } from './db/transaction.ts';
import { registerCrossSiteGuard } from './http/cross-site.ts';
import { registerErrorHandling } from './http/error-handler.ts';
import { ajvOptions } from './http/validation.ts';
import { freezeRoutes } from './modules/attendance/freeze-routes.ts';
import { createFreezeService } from './modules/attendance/freeze-service.ts';
import { createAttendanceRepository } from './modules/attendance/repository.ts';
import { attendanceRoutes } from './modules/attendance/routes.ts';
import { createAttendanceService } from './modules/attendance/service.ts';

export interface AppOptions {
  db: DatabaseSync;
  logger?: FastifyServerOptions['logger'];
  /** Reloj inyectado (DEC-07); `systemClock` por defecto. Lo usan los módulos que dependen de "hoy". */
  now?: Clock;
}

function registerHealth(app: FastifyInstance, db: DatabaseSync): void {
  app.get(
    '/api/health',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: { status: { type: 'string', const: 'ok' } },
            required: ['status'],
          },
        },
      },
    },
    () => {
      db.prepare('SELECT 1').get();
      return { status: 'ok' };
    },
  );
}

/** Único punto de composición: cada módulo recibe sus dependencias (base de datos y reloj) por inyección. */
export function buildApp({ db, logger = false, now = systemClock }: AppOptions): FastifyInstance {
  const app = Fastify({ logger, ajv: ajvOptions });
  // Antes de cualquier ruta, para que todas hereden el envelope de error y la guarda entre sitios (DEC-04, DEC-06).
  registerErrorHandling(app);
  registerCrossSiteGuard(app);

  app.addHook('onClose', () => {
    if (db.isOpen) db.close();
  });

  registerHealth(app, db);

  const deps = {
    repository: createAttendanceRepository(db),
    now,
    transaction: <T>(fn: () => T) => withTransaction(db, fn),
  };
  app.register(attendanceRoutes, {
    prefix: '/api/members',
    service: createAttendanceService(deps),
  });
  app.register(freezeRoutes, { prefix: '/api/members', service: createFreezeService(deps) });

  return app;
}
