import type { FastifyInstance } from 'fastify';
import type { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addDays } from '../../src/calendar.ts';
import { computeStreak } from '../../src/modules/attendance/streak.ts';
import { createTestApp, createTestClock, type TestClock } from '../helpers/test-app.ts';

const TODAY = '2026-11-18';
const run = (count: number, endsDaysAgo = 0, from = TODAY) =>
  Array.from({ length: count }, (_, i) => addDays(from, -(endsDaysAgo + i)));

describe('computeStreak con días congelados (HU-02)', () => {
  it('CA-05: una semana congelada sin venir ni suma ni rompe: sigue con 10', () => {
    // 10 días hasta el día 10; congelado del 11 al 17; hoy (18) aún sin check-in.
    const checkIns = run(10, 8);
    const frozen = new Set(run(7, 1));

    expect(computeStreak(checkIns, TODAY, frozen)).toBe(10);
    expect(computeStreak([...checkIns, TODAY], TODAY, frozen)).toBe(11);
  });

  it('CA-06: un check-in en un día congelado suma', () => {
    const frozen = new Set([TODAY, addDays(TODAY, -1)]);

    expect(computeStreak([TODAY, ...run(3, 2)], TODAY, frozen)).toBe(4);
  });

  it('EC-08: un hueco sin congelar sigue rompiendo la racha', () => {
    const frozen = new Set(run(2, 1)); // 16 y 17 congelados; 15 sin venir ni congelar

    expect(computeStreak([TODAY, ...run(5, 4)], TODAY, frozen)).toBe(1);
  });

  it('CA-10 / EC-09: sin congelaciones, igual que la v1', () => {
    const checkIns = [...run(4, 1), TODAY];

    expect(computeStreak(checkIns, TODAY, new Set())).toBe(computeStreak(checkIns, TODAY));
    expect(computeStreak(checkIns, TODAY)).toBe(5);
  });
});

describe('GET /api/members/:id/streak con congelaciones (HU-02)', () => {
  let app: FastifyInstance;
  let db: DatabaseSync;
  let clock: TestClock;

  beforeEach(() => {
    clock = createTestClock('2026-11-18T10:00:00.000Z');
    ({ app, db } = createTestApp({ now: clock.now }));
    db.prepare("INSERT INTO members (name) VALUES ('Lucía Ferrer')").run();
  });

  afterEach(async () => {
    await app.close();
  });

  const addCheckIns = (days: string[]) => {
    const insert = db.prepare(
      "INSERT INTO check_ins (member_id, day, created_at) VALUES (1, ?, '2026-11-01T10:00:00.000Z')",
    );
    for (const day of days) insert.run(day);
  };
  const addFreeze = (start: string, end: string, cancelledAt: string | null = null) =>
    db
      .prepare(
        "INSERT INTO freezes (member_id, start_day, end_day, created_at, cancelled_at) VALUES (1, ?, ?, '2026-11-01T10:00:00.000Z', ?)",
      )
      .run(start, end, cancelledAt);
  const streak = async () =>
    (await app.inject({ method: 'GET', url: '/api/members/1/streak' })).json<{
      days: number;
      frozenUntil: string | null;
    }>();

  it('CA-05 y CA-09: hoy congelado, la racha se mantiene y dice hasta cuándo', async () => {
    addCheckIns(run(10, 2));
    addFreeze('2026-11-17', '2026-11-20');

    expect(await streak()).toMatchObject({ days: 10, frozenUntil: '2026-11-20' });
  });

  it('EC-07: una congelación que empieza mañana no congela hoy', async () => {
    addCheckIns(run(3, 1));
    addFreeze('2026-11-19', '2026-11-20');

    expect(await streak()).toMatchObject({ days: 3, frozenUntil: null });
  });

  it('EC-10: una congelación cancelada no se salta', async () => {
    addCheckIns(run(5, 3));
    addFreeze('2026-11-16', '2026-11-17', '2026-11-10T10:00:00.000Z');

    expect(await streak()).toMatchObject({ days: 0, frozenUntil: null });
  });

  it('RNF-01: menos de 300 ms con 400 check-ins y 20 congelaciones', async () => {
    addCheckIns(run(400, 30));
    for (let i = 0; i < 20; i++)
      addFreeze(addDays('2026-11-19', i * 2), addDays('2026-11-19', i * 2));
    await streak(); // calentamiento

    const start = performance.now();
    await streak();

    expect(performance.now() - start).toBeLessThan(300);
  });
});
