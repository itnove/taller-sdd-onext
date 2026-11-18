import { madridDay } from '../../calendar.ts';
import type { Clock } from '../../clock.ts';
import { notFound } from '../../errors.ts';
import type { AttendanceRepository, Member } from './repository.ts';

export interface AttendanceServiceDeps {
  repository: AttendanceRepository;
  now: Clock;
  transaction: <T>(fn: () => T) => T;
}

export interface CheckInResult {
  day: string;
  counted: boolean;
}

/** Reglas del módulo asistencia, sin HTTP. "Hoy" sale siempre del reloj inyectado (DEC-07). */
export function createAttendanceService({ repository, now, transaction }: AttendanceServiceDeps) {
  function assertMember(memberId: number): void {
    if (!repository.memberExists(memberId)) {
      throw notFound('MEMBER_NOT_FOUND', 'El socio no existe.');
    }
  }

  return {
    listMembers(): Member[] {
      return repository.listMembers();
    },

    /** Check-in de hoy. Varios el mismo día de Madrid cuentan uno: el segundo no se guarda (FEAT-01, RN-02). */
    checkIn(memberId: number): CheckInResult {
      const instant = now();
      const day = madridDay(instant);
      // Leer y escribir sin `await` en medio, dentro de una transacción (DEC-08).
      return transaction(() => {
        assertMember(memberId);
        if (repository.hasCheckIn(memberId, day)) return { day, counted: false };
        repository.insertCheckIn(memberId, day, instant.toISOString());
        return { day, counted: true };
      });
    },
  };
}

export type AttendanceService = ReturnType<typeof createAttendanceService>;
