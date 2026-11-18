import type { FastifyInstance } from 'fastify';
import type { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, createTestClock, type TestClock } from '../helpers/test-app.ts';

describe('racha: casos adversariales (HU-01 TASK-05)', () => {
  let app: FastifyInstance;
  let db: DatabaseSync;
  let clock: TestClock;

  beforeEach(() => {
    clock = createTestClock('2026-01-14T12:00:00.000Z');
    ({ app, db } = createTestApp({ now: clock.now }));
    db.prepare("INSERT INTO members (name) VALUES ('Pau Roig')").run();
  });

  afterEach(async () => {
    await app.close();
  });

  const checkIn = () => app.inject({ method: 'POST', url: '/api/members/1/checkins' });
  const streak = (id: string = '1') =>
    app.inject({ method: 'GET', url: `/api/members/${encodeURIComponent(id)}/streak` });

  for (const [season, beforeMidnight, midnight] of [
    ['invierno (UTC+1)', '2026-01-14T22:59:59.000Z', '2026-01-14T23:00:00.000Z'],
    ['verano (UTC+2)', '2026-07-14T21:59:59.000Z', '2026-07-14T22:00:00.000Z'],
  ] as const) {
    it(`EC-02: en ${season}, 23:59:59 y 00:00:00 de Madrid son dos días seguidos`, async () => {
      clock.set(beforeMidnight);
      const first = (await checkIn()).json<{ day: string }>();
      clock.set(midnight);
      const second = (await checkIn()).json<{ day: string }>();

      expect(second.day).not.toBe(first.day);
      expect((await streak()).json()).toMatchObject({ today: second.day, days: 2 });
    });
  }

  it('EC-02: un check-in a las 23:30 UTC de invierno no cuenta en el día de UTC', async () => {
    clock.set('2026-01-14T23:30:00.000Z');
    await checkIn();

    expect((await streak()).json()).toMatchObject({ today: '2026-01-15', days: 1 });
  });

  for (const id of ["1' OR '1'='1", '0', '-1', '1.5', '99999999999999999']) {
    it(`EC-10: el id "${id}" da 400 VALIDATION_ERROR sin llegar al SQL`, async () => {
      const response = await streak(id);

      expect(response.statusCode).toBe(400);
      expect(response.json<{ error: { code: string } }>().error.code).toBe('VALIDATION_ERROR');
      expect(response.body).not.toContain('SELECT');
    });
  }

  it('EC-11: si la base falla al leer, 500 INTERNAL_ERROR sin datos del socio', async () => {
    db.exec('ALTER TABLE check_ins RENAME TO check_ins_broken');

    const response = await streak();

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: { code: 'INTERNAL_ERROR', message: 'Error interno. Inténtalo de nuevo.' },
    });
    expect(response.body).not.toContain('Pau');
    expect(response.body).not.toContain('check_ins');
  });

  it('EC-03 y CA-01: duplicados antiguos del mismo día cuentan uno y la racha nunca es negativa', async () => {
    const insert = db.prepare(
      "INSERT INTO check_ins (member_id, day, created_at) VALUES (1, ?, '2026-01-01T00:00:00.000Z')",
    );
    for (const day of ['2026-01-14', '2026-01-14', '2026-01-13', '2026-01-13', '2026-01-13']) {
      insert.run(day);
    }

    const body = (await streak()).json<{ days: number }>();

    expect(body.days).toBe(2);
    expect(body.days).toBeGreaterThanOrEqual(0);
  });
});
