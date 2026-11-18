import { addDays, isCalendarDate } from '../../calendar.ts';

/**
 * Congelar la racha (HU-02): reglas puras, con "hoy" como dato (DD-02, DEC-07). Sin HTTP ni base de datos: el
 * servicio convierte sus errores en `AppError`.
 */

/** Cupo: días congelados por año natural (FEAT-02, RN-03). */
export const MAX_FROZEN_DAYS_PER_YEAR = 7;

export interface FreezeRange {
  start: string;
  end: string;
}

export interface Freeze extends FreezeRange {
  id: number;
  createdAt: string;
  cancelledAt: string | null;
}

export type FreezeError =
  | { code: 'VALIDATION_ERROR'; field: 'start' | 'end'; message: string }
  | { code: 'FREEZE_QUOTA_EXCEEDED'; message: string; remainingDays: number }
  | { code: 'FREEZE_OVERLAP'; message: string };

export type CancelError =
  | { code: 'FREEZE_ALREADY_CANCELLED'; message: string }
  | { code: 'FREEZE_ALREADY_STARTED'; message: string };

export const isActive = (freeze: Freeze): boolean => freeze.cancelledAt === null;

/** Los días de `[start, end]`, los dos incluidos. */
export function daysOf(start: string, end: string): string[] {
  const days: string[] = [];
  for (let day = start; day <= end; day = addDays(day, 1)) days.push(day);
  return days;
}

/** Días que quedan en `year` (texto 'AAAA') contando las congelaciones activas; nunca negativo. */
export function remainingDays(freezes: readonly Freeze[], year: string): number {
  const used = freezes
    .filter(isActive)
    .flatMap((f) => daysOf(f.start, f.end))
    .filter((day) => day.startsWith(`${year}-`)).length;
  return Math.max(0, MAX_FROZEN_DAYS_PER_YEAR - used);
}

function invalid(field: 'start' | 'end', message: string): FreezeError {
  return { code: 'VALIDATION_ERROR', field, message };
}

/** Fechas válidas, desde hoy y con el fin no anterior al inicio (RN-01, RN-02; CA-01). */
function checkDates({ start, end }: FreezeRange, today: string): FreezeError | null {
  if (!isCalendarDate(start))
    return invalid('start', 'La fecha de inicio no es un día válido (AAAA-MM-DD).');
  if (!isCalendarDate(end))
    return invalid('end', 'La fecha de fin no es un día válido (AAAA-MM-DD).');
  if (start < today) {
    return invalid(
      'start',
      'No se puede congelar hacia atrás: el inicio tiene que ser hoy o después.',
    );
  }
  if (end < start) return invalid('end', 'La fecha de fin no puede ser anterior a la de inicio.');
  return null;
}

/** Cupo por año: si el rango cruza de año, cada día cuenta en el suyo (RN-03; CA-02). */
function checkQuota({ start, end }: FreezeRange, active: readonly Freeze[]): FreezeError | null {
  // Un rango de más de un año pasa del cupo seguro en algún año: basta recorrer 367 días como mucho
  // (un rango enorme, `2026-01-01` → `2099-12-31`, no cuesta más).
  const wanted = daysOf(start, minDay(end, addDays(start, 366)));
  for (const year of new Set(wanted.map((day) => day.slice(0, 4)))) {
    const left = remainingDays(active, year);
    if (wanted.filter((day) => day.startsWith(`${year}-`)).length > left) {
      return {
        code: 'FREEZE_QUOTA_EXCEEDED',
        remainingDays: left,
        message: `Solo te quedan ${left} días para congelar en ${year}.`,
      };
    }
  }
  return null;
}

const minDay = (a: string, b: string): string => (a < b ? a : b);

/** Valida una congelación nueva contra las del socio (RN-01 a RN-04; CA-01 a CA-03). `null` si vale. */
export function validateFreeze(
  input: FreezeRange,
  memberFreezes: readonly Freeze[],
  today: string,
): FreezeError | null {
  const active = memberFreezes.filter(isActive);
  const error = checkDates(input, today) ?? checkQuota(input, active);
  if (error) return error;
  if (active.some((f) => f.start <= input.end && input.start <= f.end)) {
    return {
      code: 'FREEZE_OVERLAP',
      message: 'Ya tienes una congelación que coincide con esos días.',
    };
  }
  return null;
}

/** Solo se cancela una congelación activa que aún no ha empezado (RN-07; CA-07, CA-08). `null` si se puede. */
export function checkCancel(freeze: Freeze, today: string): CancelError | null {
  if (!isActive(freeze)) {
    return { code: 'FREEZE_ALREADY_CANCELLED', message: 'Esta congelación ya estaba cancelada.' };
  }
  if (freeze.start <= today) {
    return {
      code: 'FREEZE_ALREADY_STARTED',
      message: 'Esta congelación ya ha empezado y no se puede cancelar.',
    };
  }
  return null;
}

/** Todos los días congelados de las congelaciones activas (DD-01). */
export function frozenDaySet(freezes: readonly Freeze[]): Set<string> {
  return new Set(freezes.filter(isActive).flatMap((f) => daysOf(f.start, f.end)));
}

/** El fin de la congelación activa que contiene `today`, o `null` (RN-08). */
export function frozenUntil(freezes: readonly Freeze[], today: string): string | null {
  return freezes.find((f) => isActive(f) && f.start <= today && today <= f.end)?.end ?? null;
}
