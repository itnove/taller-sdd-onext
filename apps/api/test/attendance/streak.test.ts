import { describe, expect, it } from 'vitest';
import { addDays } from '../../src/calendar.ts';
import { computeStreak } from '../../src/modules/attendance/streak.ts';

const TODAY = '2026-11-16';
/** `count` días seguidos que terminan `endsDaysAgo` días antes de hoy. */
const run = (count: number, endsDaysAgo = 0) =>
  Array.from({ length: count }, (_, i) => addDays(TODAY, -(endsDaysAgo + i)));

describe('computeStreak (HU-01)', () => {
  it('CA-01: sin check-ins es 0, un entero mayor o igual que 0', () => {
    const days = computeStreak([], TODAY);

    expect(days).toBe(0);
    expect(Number.isInteger(days)).toBe(true);
  });

  it('CA-02: con 4 días hasta ayer, el check-in de hoy la lleva a 5', () => {
    expect(computeStreak([...run(4, 1), TODAY], TODAY)).toBe(5);
  });

  it('CA-03: si faltó ayer, la racha es 0', () => {
    expect(computeStreak(run(3, 2), TODAY)).toBe(0);
  });

  it('EC-01: hoy sin check-in y ayer sí, cuenta desde ayer', () => {
    expect(computeStreak(run(6, 1), TODAY)).toBe(6);
  });

  it('EC-03: los días repetidos cuentan uno', () => {
    expect(computeStreak([TODAY, TODAY, addDays(TODAY, -1), addDays(TODAY, -1)], TODAY)).toBe(2);
  });

  it('un hueco corta la cuenta aunque haya días antes', () => {
    expect(computeStreak([...run(2), ...run(5, 3)], TODAY)).toBe(2);
  });
});
