import { madridDay } from '../../calendar.ts';
import type { Clock } from '../../clock.ts';
import { AppError, notFound } from '../../errors.ts';
import {
  checkCancel,
  isActive,
  remainingDays,
  validateFreeze,
  type Freeze,
  type FreezeError,
  type FreezeRange,
} from './freeze-rules.ts';
import type { AttendanceRepository } from './repository.ts';

export interface FreezeServiceDeps {
  repository: AttendanceRepository;
  now: Clock;
  transaction: <T>(fn: () => T) => T;
}

export interface FreezeResult {
  freeze: Freeze;
  remainingDays: number;
}

export interface FreezeList {
  today: string;
  remainingDays: number;
  freezes: Freeze[];
}

/** Traduce un error de las reglas a `AppError` (DEC-06): 400 con el campo, o 409 con `remainingDays` si es el cupo. */
function toAppError(error: FreezeError): AppError {
  if (error.code === 'VALIDATION_ERROR') {
    return new AppError(error.code, 400, 'Hay campos con errores.', [
      { field: error.field, message: error.message },
    ]);
  }
  const extra =
    error.code === 'FREEZE_QUOTA_EXCEEDED' ? { remainingDays: error.remainingDays } : undefined;
  return new AppError(error.code, 409, error.message, undefined, extra);
}

/** Congelaciones de la racha (HU-02). Leer, validar y escribir en una transacción, sin `await` en medio (DD-04). */
export function createFreezeService({ repository, now, transaction }: FreezeServiceDeps) {
  function assertMember(memberId: number): void {
    if (!repository.memberExists(memberId))
      throw notFound('MEMBER_NOT_FOUND', 'El socio no existe.');
  }

  return {
    list(memberId: number): FreezeList {
      assertMember(memberId);
      const today = madridDay(now());
      const mine = repository.memberFreezes(memberId);
      return {
        today,
        remainingDays: remainingDays(mine, today.slice(0, 4)),
        freezes: mine.filter(isActive),
      };
    },

    create(memberId: number, range: FreezeRange): FreezeResult {
      const instant = now();
      const today = madridDay(instant);
      return transaction(() => {
        assertMember(memberId);
        const mine = repository.memberFreezes(memberId);
        const error = validateFreeze(range, mine, today);
        if (error) throw toAppError(error);
        const freeze = repository.insertFreeze(memberId, range, instant.toISOString());
        return {
          freeze,
          remainingDays: remainingDays([...mine, freeze], freeze.start.slice(0, 4)),
        };
      });
    },

    /** Cancela una congelación que aún no ha empezado: marca `cancelledAt`, no borra (RN-07, DD-03). */
    cancel(memberId: number, freezeId: number): FreezeResult {
      const instant = now();
      const today = madridDay(instant);
      return transaction(() => {
        assertMember(memberId);
        const freeze = repository.findFreeze(memberId, freezeId);
        if (!freeze) throw notFound('FREEZE_NOT_FOUND', 'No existe esa congelación.');
        const error = checkCancel(freeze, today);
        if (error) throw new AppError(error.code, 409, error.message);
        repository.cancelFreeze(freeze.id, instant.toISOString());
        const mine = repository.memberFreezes(memberId);
        return {
          freeze: { ...freeze, cancelledAt: instant.toISOString() },
          remainingDays: remainingDays(mine, freeze.start.slice(0, 4)),
        };
      });
    },
  };
}

export type FreezeService = ReturnType<typeof createFreezeService>;
