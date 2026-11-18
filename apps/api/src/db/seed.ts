import type { DatabaseSync } from 'node:sqlite';
import { addDays, madridDay } from '../calendar.ts';

/**
 * Datos de ejemplo de data/gymapp.db, relativos al día del reset (Europe/Madrid). Inventados siempre: nunca personas
 * reales ni datos de salud (docs/RGPD.md).
 *
 * - Lucía: 5 días seguidos hasta hoy.
 * - Tomás: sin check-ins.
 * - Irene: 6 días seguidos hasta ayer (su check-in de hoy la lleva a 7: la felicitación).
 * - Pau: 120 días seguidos hasta hoy (una racha de tres dígitos).
 */
export const SEED_MEMBERS = [
  { name: 'Lucía Ferrer', streakEndsDaysAgo: 0, days: 5 },
  { name: 'Tomás Abad', streakEndsDaysAgo: 0, days: 0 },
  { name: 'Irene Soler', streakEndsDaysAgo: 1, days: 6 },
  { name: 'Pau Roig', streakEndsDaysAgo: 0, days: 120 },
] as const;

export function seed(db: DatabaseSync, now: Date = new Date()): void {
  const today = madridDay(now);
  const createdAt = now.toISOString();
  const insertMember = db.prepare('INSERT INTO members (name) VALUES (?)');
  const insertCheckIn = db.prepare(
    'INSERT INTO check_ins (member_id, day, created_at) VALUES (?, ?, ?)',
  );
  for (const member of SEED_MEMBERS) {
    const id = Number(insertMember.run(member.name).lastInsertRowid);
    for (let i = 0; i < member.days; i++) {
      insertCheckIn.run(id, addDays(today, -(member.streakEndsDaysAgo + i)), createdAt);
    }
  }
}
