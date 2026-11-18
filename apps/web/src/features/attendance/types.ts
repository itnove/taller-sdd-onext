export interface Member {
  id: number;
  name: string;
}

export interface CheckInResult {
  day: string;
  counted: boolean;
}

/** La racha que devuelve `GET /api/members/:id/streak`. `today` es el día de Madrid que decide la API (DEC-07). */
export interface Streak {
  memberId: number;
  today: string;
  days: number;
  congratulate: boolean;
  /** Fin de la congelación que contiene hoy, o `null` (HU-02). */
  frozenUntil: string | null;
}

/** Una congelación de la racha (HU-02): un rango de días `AAAA-MM-DD`, sin motivo. */
export interface Freeze {
  id: number;
  start: string;
  end: string;
  createdAt: string;
  cancelledAt: string | null;
}

export interface FreezeRange {
  start: string;
  end: string;
}

/** `GET /api/members/:id/freezes`: activas, días que quedan este año y el "hoy" de la API (DD-06). */
export interface FreezeListResponse {
  today: string;
  remainingDays: number;
  freezes: Freeze[];
}

export interface FreezeResult {
  freeze: Freeze;
  remainingDays: number;
}
