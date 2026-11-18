import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cacheKey,
  readCachedStreak,
  saveStreak,
} from '../../../src/features/attendance/streak-cache.ts';

describe('streak-cache (HU-01, RGPD §6)', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('guarda solo today, days y congratulate, con la clave del socio', () => {
    saveStreak(3, { today: '2026-11-16', days: 5, congratulate: false, memberId: 3 } as never);

    expect(JSON.parse(localStorage.getItem(cacheKey(3)) ?? '')).toEqual({
      today: '2026-11-16',
      days: 5,
      congratulate: false,
    });
    expect(cacheKey(3)).toBe('gymapp:streak:3');
  });

  it('lee lo guardado y devuelve null si no hay nada', () => {
    saveStreak(3, { today: '2026-11-16', days: 5, congratulate: false });

    expect(readCachedStreak(3)).toEqual({ today: '2026-11-16', days: 5, congratulate: false });
    expect(readCachedStreak(4)).toBeNull();
  });

  it('ignora un valor manipulado o que no es JSON', () => {
    localStorage.setItem(cacheKey(3), JSON.stringify({ days: -2, congratulate: 'sí' }));
    expect(readCachedStreak(3)).toBeNull();

    localStorage.setItem(cacheKey(3), '{no es json');
    expect(readCachedStreak(3)).toBeNull();
  });

  it('si el almacenamiento falla, no rompe nada', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('lleno', 'QuotaExceededError');
    });

    expect(() =>
      saveStreak(3, { today: '2026-11-16', days: 1, congratulate: false }),
    ).not.toThrow();
  });
});
