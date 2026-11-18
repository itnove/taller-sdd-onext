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
}
