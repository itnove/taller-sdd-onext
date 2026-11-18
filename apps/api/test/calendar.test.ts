import { describe, expect, it } from 'vitest';
import { addDays, isCalendarDate, madridDay } from '../src/calendar.ts';

describe('días de calendario de Europe/Madrid (DEC-07)', () => {
  it('en invierno (UTC+1), las 23:00 UTC ya son el día siguiente en Madrid', () => {
    expect(madridDay(new Date('2026-01-14T22:59:59.000Z'))).toBe('2026-01-14');
    expect(madridDay(new Date('2026-01-14T23:00:00.000Z'))).toBe('2026-01-15');
  });

  it('en verano (UTC+2), las 22:00 UTC ya son el día siguiente en Madrid', () => {
    expect(madridDay(new Date('2026-07-14T21:59:59.000Z'))).toBe('2026-07-14');
    expect(madridDay(new Date('2026-07-14T22:00:00.000Z'))).toBe('2026-07-15');
  });

  it('suma y resta días cruzando meses, años y el cambio de hora', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-03-28', 2)).toBe('2026-03-30');
  });

  it('solo acepta días que existen con el formato AAAA-MM-DD', () => {
    expect(isCalendarDate('2028-02-29')).toBe(true);
    expect(isCalendarDate('2027-02-29')).toBe(false);
    expect(isCalendarDate('2026-13-01')).toBe(false);
    expect(isCalendarDate('15/01/2026')).toBe(false);
  });
});
