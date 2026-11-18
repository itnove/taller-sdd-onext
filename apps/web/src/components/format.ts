/** Display formats of the web (DEC-07): calendar days `AAAA-MM-DD` are shown as `dd/mm/aaaa`. */

export const INVALID_DATE_TEXT = 'Fecha no válida';

const CALENDAR_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * `2027-04-06` → "06/04/2027". A calendar day has no time and no zone, so it is rearranged as text (no
 * `Date`, which would shift it with the zone of the laptop); any other format → "Fecha no válida".
 */
export function formatCalendarDate(day: string): string {
  const match = CALENDAR_DATE_PATTERN.exec(day);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : INVALID_DATE_TEXT;
}
