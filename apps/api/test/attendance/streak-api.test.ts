import type { FastifyInstance } from 'fastify';
import type { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addDays } from '../../src/calendar.ts';
import { createTestApp, createTestClock } from '../helpers/test-app.ts';

const NOW = '2026-11-16T10:00:00.000Z';
const TODAY = '2026-11-16';

describe('GET /api/members/:id/streak (HU-01)', () => {
  let app: FastifyInstance;
  let db: DatabaseSync;

  beforeEach(() => {
    ({ app, db } = createTestApp({ now: createTestClock(NOW).now }));
    db.prepare("INSERT INTO members (name) VALUES ('Irene Soler')").run();
  });

  afterEach(async () => {
    await app.close();
  });

  /** Check-ins seguidos que terminan `endsDaysAgo` días antes de hoy. */
  function addRun(count: number, endsDaysAgo = 0) {
    const insert = db.prepare(
      "INSERT INTO check_ins (member_id, day, created_at) VALUES (1, ?, '2026-11-16T10:00:00.000Z')",
    );
    for (let i = 0; i < count; i++) insert.run(addDays(TODAY, -(endsDaysAgo + i)));
  }
  const getStreak = (id: string | number = 1) =>
    app.inject({ method: 'GET', url: `/api/members/${id}/streak` });

  it('CA-02: con 4 días hasta ayer, tras el check-in de hoy la racha es 5', async () => {
    addRun(4, 1);
    await app.inject({ method: 'POST', url: '/api/members/1/checkins' });

    const response = await getStreak();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      memberId: 1,
      today: TODAY,
      days: 5,
      congratulate: false,
      frozenUntil: null,
    });
  });

  it('CA-04 y EC-07: con 6 días no felicita; el check-in de hoy la lleva a 7 y felicita', async () => {
    addRun(6, 1);
    expect((await getStreak()).json()).toMatchObject({ days: 6, congratulate: false });

    await app.inject({ method: 'POST', url: '/api/members/1/checkins' });

    expect((await getStreak()).json()).toMatchObject({ days: 7, congratulate: true });
  });

  it('la respuesta solo lleva memberId, today, days, congratulate y frozenUntil (RNF-04; HU-02)', async () => {
    addRun(2);

    const body = (await getStreak()).json<Record<string, unknown>>();

    expect(Object.keys(body).sort()).toEqual([
      'congratulate',
      'days',
      'frozenUntil',
      'memberId',
      'today',
    ]);
  });

  it('EC-04: un socio que no existe da 404 MEMBER_NOT_FOUND', async () => {
    const response = await getStreak(42);

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: { code: 'MEMBER_NOT_FOUND', message: 'El socio no existe.' },
    });
  });

  it('EC-05: consultar dos veces da lo mismo y no escribe nada', async () => {
    addRun(3);
    const before = db.prepare('SELECT COUNT(*) AS n FROM check_ins').get();

    const first = (await getStreak()).json();
    const second = (await getStreak()).json();

    expect(second).toEqual(first);
    expect(db.prepare('SELECT COUNT(*) AS n FROM check_ins').get()).toEqual(before);
  });

  it('CA-06: con 400 check-ins responde en menos de 300 ms', async () => {
    addRun(400);
    await getStreak(); // calentamiento: la primera petición compila el schema

    const start = performance.now();
    const response = await getStreak();
    const elapsed = performance.now() - start;

    expect(response.json()).toMatchObject({ days: 400 });
    expect(elapsed).toBeLessThan(300);
  });
});
