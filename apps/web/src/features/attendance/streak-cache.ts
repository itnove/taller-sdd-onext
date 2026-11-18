import { isRecord } from '../../components/http.ts';
import type { StreakLike } from './streak-view.ts';

/**
 * Última racha mostrada, para enseñarla sin conexión (HU-01, RF-04, DD-04). Es lo único que GymApp guarda en el
 * navegador (docs/RGPD.md §6): por socio, `today`, `days` y `congratulate`; nunca el nombre ni los días.
 * Leer y escribir van con `try/catch`: sin almacenamiento (modo privado, lleno) la racha se sigue mostrando.
 */
export interface CachedStreak extends StreakLike {
  today: string;
}

export const cacheKey = (memberId: number) => `gymapp:streak:${memberId}`;

function isCachedStreak(value: unknown): value is CachedStreak {
  return (
    isRecord(value) &&
    typeof value.today === 'string' &&
    typeof value.days === 'number' &&
    Number.isInteger(value.days) &&
    value.days >= 0 &&
    typeof value.congratulate === 'boolean'
  );
}

export function saveStreak(memberId: number, { today, days, congratulate }: CachedStreak): void {
  try {
    localStorage.setItem(cacheKey(memberId), JSON.stringify({ today, days, congratulate }));
  } catch {
    // Sin almacenamiento local: la racha se sigue mostrando, solo que no habrá copia sin conexión.
  }
}

/** La racha guardada del socio, o `null` si no hay ninguna o lo guardado no tiene la forma esperada. */
export function readCachedStreak(memberId: number): CachedStreak | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(cacheKey(memberId)) ?? 'null');
    return isCachedStreak(value) ? value : null;
  } catch {
    return null;
  }
}
