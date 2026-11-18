import { describe, expect, it } from 'vitest';
import {
  checkCancel,
  frozenDaySet,
  frozenUntil,
  remainingDays,
  validateFreeze,
  type Freeze,
} from '../../src/modules/attendance/freeze-rules.ts';

const TODAY = '2026-11-18';
let nextId = 1;
const freeze = (start: string, end: string, cancelledAt: string | null = null): Freeze => ({
  id: nextId++,
  start,
  end,
  createdAt: '2026-11-01T10:00:00.000Z',
  cancelledAt,
});

describe('validateFreeze (HU-02)', () => {
  for (const [start, end, field] of [
    ['2026-02-31', '2026-03-01', 'start'],
    ['18/11/2026', '2026-11-20', 'start'],
    ['', '2026-11-20', 'start'],
    ['2026-11-20', '2026-13-01', 'end'],
  ] as const) {
    it(`CA-01 / EC-01: "${start}" → "${end}" es un error en ${field}`, () => {
      expect(validateFreeze({ start, end }, [], TODAY)).toMatchObject({
        code: 'VALIDATION_ERROR',
        field,
      });
    });
  }

  it('CA-01 / EC-02: empezar hoy vale; empezar ayer, no', () => {
    expect(validateFreeze({ start: TODAY, end: TODAY }, [], TODAY)).toBeNull();
    expect(validateFreeze({ start: '2026-11-17', end: TODAY }, [], TODAY)).toMatchObject({
      field: 'start',
      message: 'No se puede congelar hacia atrás: el inicio tiene que ser hoy o después.',
    });
  });

  it('CA-01: el fin no puede ser anterior al inicio', () => {
    expect(validateFreeze({ start: '2026-11-20', end: '2026-11-19' }, [], TODAY)).toMatchObject({
      field: 'end',
    });
  });

  it('CA-02 / EC-03: exactamente 7 días en el año vale; 8, no, con los días que quedan', () => {
    expect(validateFreeze({ start: '2026-11-20', end: '2026-11-26' }, [], TODAY)).toBeNull();
    expect(validateFreeze({ start: '2026-11-20', end: '2026-11-27' }, [], TODAY)).toEqual({
      code: 'FREEZE_QUOTA_EXCEEDED',
      remainingDays: 7,
      message: 'Solo te quedan 7 días para congelar en 2026.',
    });
  });

  it('CA-02: con 5 días congelados este año, 3 más no caben y quedan 2', () => {
    const used = [freeze('2026-11-20', '2026-11-24')];

    expect(validateFreeze({ start: '2026-12-01', end: '2026-12-03' }, used, TODAY)).toMatchObject({
      code: 'FREEZE_QUOTA_EXCEEDED',
      remainingDays: 2,
    });
  });

  it('CA-02 / EC-04: del 30/12 al 02/01 cuenta 2 días en cada año', () => {
    const used = [freeze('2026-12-01', '2026-12-05')]; // quedan 2 en 2026

    expect(validateFreeze({ start: '2026-12-30', end: '2027-01-02' }, used, TODAY)).toBeNull();
    expect(validateFreeze({ start: '2026-12-29', end: '2027-01-02' }, used, TODAY)).toMatchObject({
      code: 'FREEZE_QUOTA_EXCEEDED',
      remainingDays: 2,
      message: 'Solo te quedan 2 días para congelar en 2026.',
    });
  });

  it('CA-03: compartir un día con una activa es un solape; con una cancelada, no', () => {
    const active = [freeze('2026-11-20', '2026-11-22')];
    const cancelled = [freeze('2026-11-20', '2026-11-22', '2026-11-18T09:00:00.000Z')];

    expect(validateFreeze({ start: '2026-11-22', end: '2026-11-23' }, active, TODAY)).toMatchObject(
      {
        code: 'FREEZE_OVERLAP',
      },
    );
    expect(validateFreeze({ start: '2026-11-22', end: '2026-11-23' }, cancelled, TODAY)).toBeNull();
  });

  it('CA-04: un rango válido no da error y el cupo baja', () => {
    const created = freeze('2026-11-20', '2026-11-22');

    expect(validateFreeze(created, [], TODAY)).toBeNull();
    expect(remainingDays([created], '2026')).toBe(4);
  });

  it('CA-02: un rango largo que cruza de año se pasa en el año que más días tiene', () => {
    expect(validateFreeze({ start: '2026-12-28', end: '2027-01-10' }, [], TODAY)).toMatchObject({
      code: 'FREEZE_QUOTA_EXCEEDED',
      message: 'Solo te quedan 7 días para congelar en 2027.',
    });
  });

  it('un rango enorme se rechaza por cupo sin recorrerlo entero', () => {
    expect(validateFreeze({ start: TODAY, end: '2099-12-31' }, [], TODAY)).toMatchObject({
      code: 'FREEZE_QUOTA_EXCEEDED',
    });
  });
});

describe('checkCancel (HU-02)', () => {
  it('CA-07: una que empieza mañana se puede cancelar', () => {
    expect(checkCancel(freeze('2026-11-19', '2026-11-20'), TODAY)).toBeNull();
  });

  it('CA-08: una que empieza hoy o antes ya ha empezado', () => {
    expect(checkCancel(freeze(TODAY, '2026-11-20'), TODAY)).toMatchObject({
      code: 'FREEZE_ALREADY_STARTED',
    });
  });

  it('una cancelada no se vuelve a cancelar', () => {
    expect(
      checkCancel(freeze('2026-11-25', '2026-11-26', '2026-11-18T09:00:00.000Z'), TODAY),
    ).toMatchObject({ code: 'FREEZE_ALREADY_CANCELLED' });
  });
});

describe('frozenDaySet y frozenUntil (HU-02)', () => {
  it('solo cuentan las activas y frozenUntil es el fin de la que contiene hoy', () => {
    const freezes = [
      freeze('2026-11-17', '2026-11-19'),
      freeze('2026-11-25', '2026-11-26', '2026-11-18T09:00:00.000Z'),
    ];

    expect([...frozenDaySet(freezes)]).toEqual(['2026-11-17', '2026-11-18', '2026-11-19']);
    expect(frozenUntil(freezes, TODAY)).toBe('2026-11-19');
    expect(frozenUntil(freezes, '2026-11-25')).toBeNull();
  });
});
