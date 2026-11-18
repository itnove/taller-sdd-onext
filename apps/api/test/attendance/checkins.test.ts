import type { FastifyInstance } from 'fastify';
import type { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, createTestClock, type TestClock } from '../helpers/test-app.ts';

describe('POST /api/members/:id/checkins', () => {
  let app: FastifyInstance;
  let db: DatabaseSync;
  let clock: TestClock;

  beforeEach(() => {
    clock = createTestClock('2026-11-16T10:00:00.000Z');
    ({ app, db } = createTestApp({ now: clock.now }));
    db.prepare("INSERT INTO members (name) VALUES ('Lucía Ferrer')").run();
  });

  afterEach(async () => {
    await app.close();
  });

  const checkIn = (id: string | number = 1) =>
    app.inject({ method: 'POST', url: `/api/members/${id}/checkins` });
  const count = () => db.prepare('SELECT COUNT(*) AS n FROM check_ins').get()?.n;

  it('registra el check-in del día de Madrid', async () => {
    const response = await checkIn();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ day: '2026-11-16', counted: true });
    expect(count()).toBe(1);
  });

  it('un segundo check-in el mismo día cuenta uno y no se guarda (RN-02)', async () => {
    await checkIn();
    clock.advance(5 * 60 * 60 * 1000);

    const response = await checkIn();

    expect(response.json()).toEqual({ day: '2026-11-16', counted: false });
    expect(count()).toBe(1);
  });

  it('a las 23:30 UTC de invierno ya es el día siguiente en Madrid (DEC-07)', async () => {
    clock.set('2026-11-16T23:30:00.000Z');

    const response = await checkIn();

    expect(response.json()).toEqual({ day: '2026-11-17', counted: true });
  });

  it('un socio que no existe da 404 MEMBER_NOT_FOUND sin guardar nada', async () => {
    const response = await checkIn(99);

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: { code: 'MEMBER_NOT_FOUND', message: 'El socio no existe.' },
    });
    expect(count()).toBe(0);
  });

  it('un id que no es un entero positivo da 400 VALIDATION_ERROR', async () => {
    const response = await checkIn('abc');

    expect(response.statusCode).toBe(400);
    expect(response.json<{ error: { code: string } }>().error.code).toBe('VALIDATION_ERROR');
  });
});
