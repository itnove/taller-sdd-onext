import { describe, expect, it } from 'vitest';
import {
  CONGRATS_MESSAGE,
  EMPTY_MESSAGE,
  OFFLINE_EMPTY,
  OFFLINE_NOTICE,
  streakView,
} from '../../../src/features/attendance/streak-view.ts';

describe('streakView (HU-01)', () => {
  it('CA-03: 0 días → "Empieza tu racha hoy"', () => {
    expect(streakView({ days: 0, congratulate: false })).toEqual({
      state: 'empty',
      number: '0',
      label: 'días seguidos',
      message: EMPTY_MESSAGE,
      notice: '',
      frozen: '',
    });
  });

  it('1 día va en singular', () => {
    expect(streakView({ days: 1, congratulate: false }).label).toBe('día seguido');
  });

  it('CA-04 y EC-07: con 6 días no felicita; con 7 sí', () => {
    expect(streakView({ days: 6, congratulate: false }).message).toBe('');
    expect(streakView({ days: 7, congratulate: true }).message).toBe(CONGRATS_MESSAGE);
  });

  it('EC-06: una racha de tres dígitos se pinta entera', () => {
    expect(streakView({ days: 120, congratulate: true })).toMatchObject({
      number: '120',
      label: 'días seguidos',
    });
  });

  it('sin conexión, añade el aviso a la racha guardada', () => {
    expect(streakView({ days: 5, congratulate: false }, { offline: true }).notice).toBe(
      OFFLINE_NOTICE,
    );
  });

  it('sin nada guardado, solo el aviso y ningún número', () => {
    expect(streakView(null, { offline: true })).toEqual({
      state: 'offline',
      number: '',
      label: '',
      message: '',
      notice: OFFLINE_EMPTY,
      frozen: '',
    });
  });

  it('CA-09 (HU-02): con frozenUntil, el texto de congelada en dd/mm/aaaa; sin él, nada', () => {
    expect(streakView({ days: 3, congratulate: false, frozenUntil: '2027-01-02' }).frozen).toBe(
      'Racha congelada hasta el 02/01/2027',
    );
    expect(streakView({ days: 3, congratulate: false, frozenUntil: null }).frozen).toBe('');
  });
});
