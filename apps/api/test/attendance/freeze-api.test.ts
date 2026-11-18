import type { FastifyInstance } from 'fastify';
import type { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, createTestClock } from '../helpers/test-app.ts';

// 2026-11-18 a las 11:00 en Madrid.
const NOW = '2026-11-18T10:00:00.000Z';

describe('POST y GET /api/members/:id/freezes (HU-02)', () => {
  let app: FastifyInstance;
  let db: DatabaseSync;

  beforeEach(() => {
    ({ app, db } = createTestApp({ now: createTestClock(NOW).now }));
    db.prepare("INSERT INTO members (name) VALUES ('Lucía Ferrer'), ('Tomás Abad')").run();
  });

  afterEach(async () => {
    await app.close();
  });

  const create = (payload: unknown, id = 1) =>
    app.inject({ method: 'POST', url: `/api/members/${id}/freezes`, payload: payload as object });
  const list = (id = 1) => app.inject({ method: 'GET', url: `/api/members/${id}/freezes` });
  const count = () => db.prepare('SELECT COUNT(*) AS n FROM freezes').get()?.n;

  it('CA-04: congela un rango válido desde hoy y devuelve los días que quedan', async () => {
    const response = await create({ start: '2026-11-18', end: '2026-11-20' });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      freeze: {
        id: 1,
        start: '2026-11-18',
        end: '2026-11-20',
        createdAt: NOW,
        cancelledAt: null,
      },
      remainingDays: 4,
    });
  });

  it('CA-04: la congelación aparece en la lista con el cupo del año de hoy', async () => {
    await create({ start: '2026-11-25', end: '2026-11-26' });

    expect((await list()).json()).toEqual({
      today: '2026-11-18',
      remainingDays: 5,
      freezes: [
        { id: 1, start: '2026-11-25', end: '2026-11-26', createdAt: NOW, cancelledAt: null },
      ],
    });
  });

  it('las congelaciones de un socio no salen en la lista de otro', async () => {
    await create({ start: '2026-11-25', end: '2026-11-26' }, 1);

    expect((await list(2)).json()).toMatchObject({ remainingDays: 7, freezes: [] });
  });

  it('CA-01 / EC-02: empezar ayer da 400 en start y no guarda nada', async () => {
    const response = await create({ start: '2026-11-17', end: '2026-11-20' });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Hay campos con errores.',
        details: [
          {
            field: 'start',
            message: 'No se puede congelar hacia atrás: el inicio tiene que ser hoy o después.',
          },
        ],
      },
    });
    expect(count()).toBe(0);
  });

  it('CA-01 / EC-01: un día que no existe o un campo ausente dan 400 con su campo', async () => {
    const invalidDay = await create({ start: '2026-11-20', end: '2026-02-31' });
    const missing = await create({ start: '2026-11-20' });

    expect(
      invalidDay.json<{ error: { details: { field: string }[] } }>().error.details[0]!.field,
    ).toBe('end');
    expect(missing.statusCode).toBe(400);
    expect(
      missing.json<{ error: { details: { field: string }[] } }>().error.details[0]!.field,
    ).toBe('end');
    expect(count()).toBe(0);
  });

  it('CA-02 / EC-03: con 5 días congelados, 3 más dan 409 con los 2 que quedan', async () => {
    await create({ start: '2026-11-20', end: '2026-11-24' });

    const response = await create({ start: '2026-12-01', end: '2026-12-03' });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      error: {
        code: 'FREEZE_QUOTA_EXCEEDED',
        message: 'Solo te quedan 2 días para congelar en 2026.',
        remainingDays: 2,
      },
    });
    expect(count()).toBe(1);
  });

  it('CA-03 / EC-16: una que comparte un día con otra da 409 FREEZE_OVERLAP', async () => {
    await create({ start: '2026-11-20', end: '2026-11-22' });

    const response = await create({ start: '2026-11-22', end: '2026-11-23' });

    expect(response.statusCode).toBe(409);
    expect(response.json<{ error: { code: string } }>().error.code).toBe('FREEZE_OVERLAP');
    expect(count()).toBe(1);
  });

  it('un socio que no existe da 404 MEMBER_NOT_FOUND', async () => {
    const response = await create({ start: '2026-11-20', end: '2026-11-22' }, 99);

    expect(response.statusCode).toBe(404);
    expect((await list(99)).statusCode).toBe(404);
  });
});
