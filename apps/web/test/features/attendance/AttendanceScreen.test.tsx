import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AttendanceScreen } from '../../../src/features/attendance/AttendanceScreen.tsx';
import {
  ALREADY_CHECKED_IN,
  CHECK_IN_OFFLINE,
  CHECKED_IN,
} from '../../../src/features/attendance/CheckInButton.tsx';
import { mockFetch } from '../../helpers/fetch.ts';

const STREAK = (id: number) => ({
  [`GET /api/members/${id}/streak`]: {
    status: 200,
    json: { memberId: id, today: '2026-11-16', days: 0, congratulate: false },
  },
});

const MEMBERS = {
  status: 200,
  json: {
    members: [
      { id: 2, name: 'Irene Soler' },
      { id: 1, name: 'Lucía Ferrer' },
    ],
  },
};

describe('AttendanceScreen (T-02)', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('carga los socios en el selector "Socio"', async () => {
    mockFetch({ ...STREAK(2), 'GET /api/members': MEMBERS });

    render(<AttendanceScreen />);

    expect(screen.getByRole('status').textContent).toBe('Cargando socios…');
    const select = await screen.findByLabelText<HTMLSelectElement>('Socio');
    expect([...select.options].map((o) => o.text)).toEqual(['Irene Soler', 'Lucía Ferrer']);
  });

  it('si no carga, avisa y permite reintentar', async () => {
    let calls = 0;
    mockFetch({
      ...STREAK(2),
      'GET /api/members': () => (++calls === 1 ? { networkError: true } : MEMBERS),
    });

    render(<AttendanceScreen />);
    fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByLabelText('Socio')).toBeDefined();
  });

  it('hace check-in del socio elegido y lo anuncia', async () => {
    const fetchMock = mockFetch({
      ...STREAK(1),
      ...STREAK(2),
      'GET /api/members': MEMBERS,
      'POST /api/members/1/checkins': { status: 200, json: { day: '2026-11-16', counted: true } },
    });
    render(<AttendanceScreen />);
    fireEvent.change(await screen.findByLabelText('Socio'), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: 'Hacer check-in hoy' }));

    expect(await screen.findByText(CHECKED_IN)).toBeDefined();
    expect(fetchMock.calls.find((c) => c.method === 'POST')?.body).toBeUndefined();
  });

  it('un segundo check-in el mismo día lo dice', async () => {
    mockFetch({
      ...STREAK(2),
      'GET /api/members': MEMBERS,
      'POST /api/members/2/checkins': { status: 200, json: { day: '2026-11-16', counted: false } },
    });
    render(<AttendanceScreen />);

    fireEvent.click(await screen.findByRole('button', { name: 'Hacer check-in hoy' }));

    expect(await screen.findByText(ALREADY_CHECKED_IN)).toBeDefined();
  });

  it('sin conexión, avisa de que el check-in no se ha registrado', async () => {
    mockFetch({
      'GET /api/members': MEMBERS,
      'POST /api/members/2/checkins': { networkError: true },
    });
    render(<AttendanceScreen />);

    fireEvent.click(await screen.findByRole('button', { name: 'Hacer check-in hoy' }));

    expect(await screen.findByText(CHECK_IN_OFFLINE)).toBeDefined();
  });
});
