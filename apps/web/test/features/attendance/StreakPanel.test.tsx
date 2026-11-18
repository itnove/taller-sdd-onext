import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AttendanceScreen } from '../../../src/features/attendance/AttendanceScreen.tsx';
import { StreakPanel } from '../../../src/features/attendance/StreakPanel.tsx';
import { saveStreak } from '../../../src/features/attendance/streak-cache.ts';
import {
  CONGRATS_MESSAGE,
  EMPTY_MESSAGE,
  OFFLINE_EMPTY,
  OFFLINE_NOTICE,
} from '../../../src/features/attendance/streak-view.ts';
import { mockFetch } from '../../helpers/fetch.ts';

const streak = (days: number, congratulate = days >= 7) => ({
  status: 200,
  json: { memberId: 1, today: '2026-11-16', days, congratulate, frozenUntil: null },
});

describe('StreakPanel (HU-01)', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('muestra "Cargando tu racha…" y después el número grande', async () => {
    mockFetch({ 'GET /api/members/1/streak': streak(5) });

    render(<StreakPanel memberId={1} refreshKey={0} />);

    expect(screen.getByRole('status').textContent).toBe('Cargando tu racha…');
    const panel = await screen.findByRole('status', { name: 'Tu racha' });
    expect(panel.textContent).toContain('5');
    expect(panel.textContent).toContain('días seguidos');
  });

  it('CA-03: con 0 días invita a empezar', async () => {
    mockFetch({ 'GET /api/members/1/streak': streak(0) });

    render(<StreakPanel memberId={1} refreshKey={0} />);

    expect(await screen.findByText(EMPTY_MESSAGE)).toBeDefined();
  });

  it('CA-04: con 7 días felicita', async () => {
    mockFetch({ 'GET /api/members/1/streak': streak(7) });

    render(<StreakPanel memberId={1} refreshKey={0} />);

    expect(await screen.findByText(CONGRATS_MESSAGE)).toBeDefined();
  });

  it('EC-12: una respuesta con forma inesperada da error con reintento, sin número', async () => {
    mockFetch({ 'GET /api/members/1/streak': { status: 200, json: { days: 'muchos' } } });

    render(<StreakPanel memberId={1} refreshKey={0} />);

    expect(await screen.findByRole('alert')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeDefined();
    expect(screen.queryByText('muchos')).toBeNull();
  });

  it('CA-02: tras el check-in de hoy la racha se refresca de 4 a 5', async () => {
    let days = 4;
    mockFetch({
      'GET /api/members': { status: 200, json: { members: [{ id: 1, name: 'Lucía Ferrer' }] } },
      'GET /api/members/1/freezes': {
        status: 200,
        json: { today: '2026-11-16', remainingDays: 7, freezes: [] },
      },
      'GET /api/members/1/streak': () => streak(days),
      'POST /api/members/1/checkins': () => {
        days = 5;
        return { status: 200, json: { day: '2026-11-16', counted: true } };
      },
    });
    render(<AttendanceScreen />);
    expect((await screen.findByRole('status', { name: 'Tu racha' })).textContent).toContain('4');

    fireEvent.click(screen.getByRole('button', { name: 'Hacer check-in hoy' }));

    await screen.findByText('Check-in registrado.');
    expect((await screen.findByRole('status', { name: 'Tu racha' })).textContent).toContain('5');
  });

  it('CA-05: sin conexión, la última racha guardada con el aviso', async () => {
    saveStreak(1, { today: '2026-11-15', days: 12, congratulate: true });
    mockFetch({ 'GET /api/members/1/streak': { networkError: true } });

    render(<StreakPanel memberId={1} refreshKey={0} />);

    const panel = await screen.findByRole('status', { name: 'Tu racha' });
    expect(panel.textContent).toContain('12');
    expect(panel.textContent).toContain(OFFLINE_NOTICE);
  });

  it('EC-08: sin conexión y sin nada guardado, solo el aviso', async () => {
    mockFetch({ 'GET /api/members/1/streak': { networkError: true } });

    render(<StreakPanel memberId={1} refreshKey={0} />);

    const panel = await screen.findByRole('status', { name: 'Tu racha' });
    expect(panel.textContent).toBe(OFFLINE_EMPTY);
  });

  it('una carga correcta deja guardada la racha para la próxima vez sin conexión', async () => {
    mockFetch({ 'GET /api/members/1/streak': streak(9) });
    render(<StreakPanel memberId={1} refreshKey={0} />);
    await screen.findByRole('status', { name: 'Tu racha' });

    expect(JSON.parse(localStorage.getItem('gymapp:streak:1') ?? '')).toEqual({
      today: '2026-11-16',
      days: 9,
      congratulate: true,
    });
  });

  it('CA-09 (HU-02): hoy congelado, "Racha congelada hasta el dd/mm/aaaa" junto a la racha', async () => {
    mockFetch({
      'GET /api/members/1/streak': {
        status: 200,
        json: {
          memberId: 1,
          today: '2026-11-18',
          days: 10,
          congratulate: true,
          frozenUntil: '2026-11-22',
        },
      },
    });

    render(<StreakPanel memberId={1} refreshKey={0} />);

    const panel = await screen.findByRole('status', { name: 'Tu racha' });
    expect(panel.textContent).toContain('10');
    expect(panel.textContent).toContain('Racha congelada hasta el 22/11/2026');
  });
});
