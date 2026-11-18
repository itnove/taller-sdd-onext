import type { DatabaseSync } from 'node:sqlite';

export interface Member {
  id: number;
  name: string;
}

/** SQL del módulo asistencia: siempre sentencias preparadas con parámetros (DEC-08). */
export function createAttendanceRepository(db: DatabaseSync) {
  return {
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
