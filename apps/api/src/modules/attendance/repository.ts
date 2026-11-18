import type { DatabaseSync } from 'node:sqlite';
import type { Freeze, FreezeRange } from './freeze-rules.ts';

export interface Member {
  id: number;
  name: string;
}

const FREEZE_COLUMNS = 'id, start_day, end_day, created_at, cancelled_at';

function toFreeze(row: Record<string, unknown>): Freeze {
  return {
    id: Number(row.id),
    start: String(row.start_day),
    end: String(row.end_day),
    createdAt: String(row.created_at),
    cancelledAt: row.cancelled_at === null ? null : String(row.cancelled_at),
  };
}

/** SQL de las congelaciones (HU-02). Siempre por socio: nunca se lee la congelación de otro (EC-12). */
function createFreezeOperations(db: DatabaseSync) {
  return {
    /** Todas las congelaciones del socio, también las canceladas, por inicio. */
    memberFreezes(memberId: number): Freeze[] {
      return db
        .prepare(`SELECT ${FREEZE_COLUMNS} FROM freezes WHERE member_id = ? ORDER BY start_day, id`)
        .all(memberId)
        .map(toFreeze);
    },
    /** La congelación `freezeId` del socio; `undefined` si no existe o es de otro socio (EC-12). */
    findFreeze(memberId: number, freezeId: number): Freeze | undefined {
      const row = db
        .prepare(`SELECT ${FREEZE_COLUMNS} FROM freezes WHERE id = ? AND member_id = ?`)
        .get(freezeId, memberId);
      return row === undefined ? undefined : toFreeze(row);
    },
    cancelFreeze(freezeId: number, cancelledAt: string): void {
      db.prepare('UPDATE freezes SET cancelled_at = ? WHERE id = ?').run(cancelledAt, freezeId);
    },
    insertFreeze(memberId: number, { start, end }: FreezeRange, createdAt: string): Freeze {
      const { lastInsertRowid } = db
        .prepare(
          'INSERT INTO freezes (member_id, start_day, end_day, created_at) VALUES (?, ?, ?, ?)',
        )
        .run(memberId, start, end, createdAt);
      return { id: Number(lastInsertRowid), start, end, createdAt, cancelledAt: null };
    },
  };
}

/** SQL del módulo asistencia: siempre sentencias preparadas con parámetros (DEC-08). */
export function createAttendanceRepository(db: DatabaseSync) {
  return {
    ...createFreezeOperations(db),
    listMembers(): Member[] {
      return db
        .prepare('SELECT id, name FROM members ORDER BY name, id')
        .all()
        .map((row) => ({ id: Number(row.id), name: String(row.name) }));
    },
    memberExists(id: number): boolean {
      return db.prepare('SELECT 1 FROM members WHERE id = ?').get(id) !== undefined;
    },
    hasCheckIn(memberId: number, day: string): boolean {
      return (
        db.prepare('SELECT 1 FROM check_ins WHERE member_id = ? AND day = ?').get(memberId, day) !==
        undefined
      );
    },
    /** Días distintos con check-in del socio (los duplicados antiguos salen una vez). */
    checkInDays(memberId: number): string[] {
      return db
        .prepare('SELECT DISTINCT day FROM check_ins WHERE member_id = ? ORDER BY day DESC')
        .all(memberId)
        .map((row) => String(row.day));
    },
    insertCheckIn(memberId: number, day: string, createdAt: string): void {
      db.prepare('INSERT INTO check_ins (member_id, day, created_at) VALUES (?, ?, ?)').run(
        memberId,
        day,
        createdAt,
      );
    },
  };
}

export type AttendanceRepository = ReturnType<typeof createAttendanceRepository>;
