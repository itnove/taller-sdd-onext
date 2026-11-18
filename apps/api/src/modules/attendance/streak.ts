import { addDays } from '../../calendar.ts';

/** A partir de cuántos días se felicita al socio (FEAT-01, RN-05; HU-01, DD-02: lo decide la API). */
export const CONGRATULATE_FROM_DAYS = 7;

/**
 * La racha: días seguidos con check-in, contando hacia atrás desde `today` (HU-01, DD-01). Pura: "hoy" llega como
 * parámetro (DEC-07). Si hoy aún no hay check-in, la racha sigue viva y se cuenta desde ayer (RN-03); un día sin
 * check-in corta la cuenta (RN-04); los días repetidos cuentan uno (RN-02).
 *
 * HU-02 (DD-01): un día congelado sin check-in se salta, sin sumar ni cortar (FEAT-02 · RN-05); un check-in en un día
 * congelado suma como cualquier otro (RN-06). Sin congelaciones, el resultado es el de la v1 (CA-10).
 */
export function computeStreak(
  checkInDays: readonly string[],
  today: string,
  frozenDays: ReadonlySet<string> = new Set(),
): number {
  const days = new Set(checkInDays);
  let cursor = days.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (days.has(cursor) || frozenDays.has(cursor)) {
    if (days.has(cursor)) count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}
