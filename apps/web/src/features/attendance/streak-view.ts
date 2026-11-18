/** Vista de la racha: función pura, sin DOM, para probar cada estado (HU-01, DD-03). */

export const EMPTY_MESSAGE = 'Empieza tu racha hoy';
export const CONGRATS_MESSAGE = '¡Enhorabuena! Ya llevas una semana o más sin fallar.';
export const OFFLINE_NOTICE = 'Sin conexión: esta es tu última racha guardada.';
export const OFFLINE_EMPTY = 'Sin conexión y sin ninguna racha guardada todavía.';

export interface StreakLike {
  days: number;
  congratulate: boolean;
}

export interface StreakView {
  state: 'empty' | 'streak' | 'offline';
  number: string;
  label: string;
  message: string;
  notice: string;
}

/** `streak` es la de la API o la guardada; `null`, que no hay ninguna (solo pasa sin conexión). */
export function streakView(
  streak: StreakLike | null,
  { offline = false }: { offline?: boolean } = {},
): StreakView {
  const notice = offline ? OFFLINE_NOTICE : '';
  if (!streak)
    return { state: 'offline', number: '', label: '', message: '', notice: OFFLINE_EMPTY };
  const { days, congratulate } = streak;
  if (days === 0) {
    return { state: 'empty', number: '0', label: 'días seguidos', message: EMPTY_MESSAGE, notice };
  }
  return {
    state: 'streak',
    number: String(days),
    label: days === 1 ? 'día seguido' : 'días seguidos',
    message: congratulate ? CONGRATS_MESSAGE : '',
    notice,
  };
}
