import type { FastifyInstance } from 'fastify';
import type { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, createTestClock, type TestClock } from '../helpers/test-app.ts';

describe('DELETE /api/members/:id/freezes/:freezeId (HU-02)', () => {
  let app: FastifyInstance;
  let db: DatabaseSync;
  let clock: TestClock;

  beforeEach(() => {
    clock = createTestClock('2026-11-18T10:00:00.000Z');
    ({ app, db } = createTestApp({ now: clock.now }));
    db.prepare("INSERT INTO members (name) VALUES ('Lucía Ferrer'), ('Tomás Abad')").run();
  });

  afterEach(async () => {
    await app.close();
  });

  const create = (start: string, end: string, id = 1) =>
    app.inject({ method: 'POST', url: `/api/members/${id}/freezes`, payload: { start, end } });
  const cancel = (freezeId: number | string, id = 1) =>
    app.inject({ method: 'DELETE', url: `/api/members/${id}/freezes/${freezeId}` });
  const list = async (id = 1) =>
    (await app.inject({ method: 'GET', url: `/api/members/${id}/freezes` })).json<{
      remainingDays: number;
      freezes: unknown[];
    }>();

  it('CA-07: cancela una que empieza la semana que viene y sus días vuelven al cupo', async () => {
    await create('2026-11-25', '2026-11-27');
    expect((await list()).remainingDays).toBe(4);
    clock.advance(60 * 60 * 1000);

    const response = await cancel(1);

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      freeze: {
        id: 1,
        start: '2026-11-25',
        end: '2026-11-27',
        createdAt: '2026-11-18T10:00:00.000Z',
        cancelledAt: '2026-11-18T11:00:00.000Z',
      },
      remainingDays: 7,
    });
    expect(await list()).toMatchObject({ remainingDays: 7, freezes: [] });
  });

  it('CA-07: se puede volver a congelar los días de una cancelada', async () => {
    await create('2026-11-25', '2026-11-27');
    await cancel(1);

    expect((await create('2026-11-26', '2026-11-26')).statusCode).toBe(201);
  });

  it('CA-08: una que empieza hoy ya ha empezado y no se cancela', async () => {
    await create('2026-11-18', '2026-11-19');

    const response = await cancel(1);

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      error: {
        code: 'FREEZE_ALREADY_STARTED',
        message: 'Esta congelación ya ha empezado y no se puede cancelar.',
      },
    });
    expect((await list()).freezes).toHaveLength(1);
  });

  it('CA-08: la que empezó ayer tampoco', async () => {
    await create('2026-11-18', '2026-11-20');
    clock.set('2026-11-19T10:00:00.000Z');

    expect((await cancel(1)).json<{ error: { code: string } }>().error.code).toBe(
      'FREEZE_ALREADY_STARTED',
    );
  });

  it('EC-11: cancelar dos veces da 409 FREEZE_ALREADY_CANCELLED y no cambia nada', async () => {
    await create('2026-11-25', '2026-11-27');
    await cancel(1);
    const before = db.prepare('SELECT cancelled_at FROM freezes WHERE id = 1').get();
    clock.advance(60_000);

    const response = await cancel(1);

    expect(response.statusCode).toBe(409);
    expect(response.json<{ error: { code: string } }>().error.code).toBe(
      'FREEZE_ALREADY_CANCELLED',
    );
    expect(db.prepare('SELECT cancelled_at FROM freezes WHERE id = 1').get()).toEqual(before);
  });

  it('EC-12: la de otro socio o una que no existe dan 404 FREEZE_NOT_FOUND', async () => {
    await create('2026-11-25', '2026-11-27', 1);

    const otherMember = await cancel(1, 2);
    const missing = await cancel(42, 1);

    expect(otherMember.statusCode).toBe(404);
    expect(otherMember.json()).toEqual({
      error: { code: 'FREEZE_NOT_FOUND', message: 'No existe esa congelación.' },
    });
    expect(missing.statusCode).toBe(404);
    expect((await list(1)).freezes).toHaveLength(1);
  });

  it('un freezeId que no es un entero positivo da 400', async () => {
    expect((await cancel("1' OR '1'='1")).statusCode).toBe(400);
  });
});
