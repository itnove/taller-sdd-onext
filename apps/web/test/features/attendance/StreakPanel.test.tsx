import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AttendanceScreen } from '../../../src/features/attendance/AttendanceScreen.tsx';
import { StreakPanel } from '../../../src/features/attendance/StreakPanel.tsx';
import { CONGRATS_MESSAGE, EMPTY_MESSAGE } from '../../../src/features/attendance/streak-view.ts';
import { mockFetch } from '../../helpers/fetch.ts';

const streak = (days: number, congratulate = days >= 7) => ({
  status: 200,
  json: { memberId: 1, today: '2026-11-16', days, congratulate },
});

describe('StreakPanel (HU-01)', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
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
});
