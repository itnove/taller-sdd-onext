/**
 * Días de calendario de Europe/Madrid (DEC-07). Transversal: no es un módulo de negocio. Un día es un texto
 * 'AAAA-MM-DD'; la aritmética de días se hace en UTC sobre ese texto, así que el cambio de hora no la altera.
 */

const MADRID_DAY = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Madrid',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const CALENDAR_DATE = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

/** Día de calendario 'AAAA-MM-DD' en Europe/Madrid de un instante. Lanza `RangeError` si el instante no es válido. */
export function madridDay(instant: Date): string {
  const parts = MADRID_DAY.formatToParts(instant);
  const part = (type: string): string => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

/** Instante UTC a medianoche de 'AAAA-MM-DD' (`setUTCFullYear`: `Date.UTC` suma 1900 a los años < 100). */
function utcMidnight(year: number, month: number, day: number): Date {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

/** `true` si es 'AAAA-MM-DD' y un día que existe (rechaza 2027-02-29 y 2026-13-01). */
export function isCalendarDate(text: string): boolean {
  const match = CALENDAR_DATE.exec(text);
  if (match === null) return false;
  const date = utcMidnight(Number(match[1]), Number(match[2]), Number(match[3]));
  return date.toISOString().slice(0, 10) === text;
}

/** Suma (o resta, con negativos) días de calendario a una 'AAAA-MM-DD' válida. */
export function addDays(day: string, days: number): string {
  const match = CALENDAR_DATE.exec(day);
  if (match === null) throw new RangeError('Fecha no válida');
  const result = utcMidnight(Number(match[1]), Number(match[2]), Number(match[3]));
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}
