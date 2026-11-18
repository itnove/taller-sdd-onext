import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FREEZE_OFFLINE } from '../../../src/features/attendance/FreezeForm.tsx';
import { FreezeSection } from '../../../src/features/attendance/FreezeSection.tsx';
import { mockFetch, type MockReply } from '../../helpers/fetch.ts';

const TODAY = '2026-11-18';
const freeze = (id: number, start: string, end: string) => ({
  id,
  start,
  end,
  createdAt: '2026-11-18T10:00:00.000Z',
  cancelledAt: null,
});
const listOf = (remainingDays: number, freezes: unknown[]): MockReply => ({
  status: 200,
  json: { today: TODAY, remainingDays, freezes },
});

function fillAndSubmit(start: string, end: string) {
  fireEvent.change(screen.getByLabelText('Desde'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: end } });
  fireEvent.click(screen.getByRole('button', { name: 'Congelar' }));
}

describe('FreezeSection (HU-02)', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('muestra el cupo y la lista; "Cancelar" solo en las que aún no han empezado', async () => {
    mockFetch({
      'GET /api/members/1/freezes': listOf(3, [
        freeze(1, '2026-11-17', '2026-11-18'),
        freeze(2, '2026-11-25', '2026-11-26'),
      ]),
    });

    render(<FreezeSection memberId={1} onChanged={() => {}} />);

    expect(await screen.findByText('Te quedan 3 días para congelar este año.')).toBeDefined();
    const items = within(screen.getByRole('list', { name: 'Tus congelaciones' })).getAllByRole(
      'listitem',
    );
    expect(items.map((li) => li.textContent)).toEqual([
      'Del 17/11/2026 al 18/11/2026 ',
      'Del 25/11/2026 al 26/11/2026 Cancelar',
    ]);
  });

  it('CA-04: congela, avisa, recarga la lista y pide recargar la racha', async () => {
    let created = false;
    const fetchMock = mockFetch({
      'GET /api/members/1/freezes': () =>
        created ? listOf(5, [freeze(1, TODAY, '2026-11-19')]) : listOf(7, []),
      'POST /api/members/1/freezes': () => {
        created = true;
        return { status: 201, json: { freeze: freeze(1, TODAY, '2026-11-19'), remainingDays: 5 } };
      },
    });
    const onChanged = vi.fn();
    render(<FreezeSection memberId={1} onChanged={onChanged} />);
    await screen.findByText('No tienes ninguna congelación.');

    fillAndSubmit(TODAY, '2026-11-19');

    expect(await screen.findByText('Racha congelada del 18/11/2026 al 19/11/2026.')).toBeDefined();
    expect(await screen.findByText('Te quedan 5 días para congelar este año.')).toBeDefined();
    expect(onChanged).toHaveBeenCalledTimes(1);
    expect(fetchMock.calls.find((c) => c.method === 'POST')?.body).toBe(
      JSON.stringify({ start: TODAY, end: '2026-11-19' }),
    );
    expect(screen.getByLabelText<HTMLInputElement>('Desde').value).toBe('');
  });

  it('CA-01: un 400 se muestra junto a su campo y no se pierde lo escrito', async () => {
    mockFetch({
      'GET /api/members/1/freezes': listOf(7, []),
      'POST /api/members/1/freezes': {
        status: 400,
        json: {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Hay campos con errores.',
            details: [{ field: 'start', message: 'No se puede congelar hacia atrás.' }],
          },
        },
      },
    });
    render(<FreezeSection memberId={1} onChanged={() => {}} />);
    await screen.findByText('No tienes ninguna congelación.');

    fillAndSubmit('2026-11-17', '2026-11-19');

    const error = await screen.findByRole('alert');
    expect(error.textContent).toBe('No se puede congelar hacia atrás.');
    const start = screen.getByLabelText<HTMLInputElement>('Desde');
    expect(start.getAttribute('aria-describedby')).toBe(error.id);
    expect(start.value).toBe('2026-11-17');
  });

  it('CA-02: un 409 de cupo muestra el mensaje de la API bajo el formulario', async () => {
    mockFetch({
      'GET /api/members/1/freezes': listOf(2, []),
      'POST /api/members/1/freezes': {
        status: 409,
        json: {
          error: {
            code: 'FREEZE_QUOTA_EXCEEDED',
            message: 'Solo te quedan 2 días para congelar en 2026.',
            remainingDays: 2,
          },
        },
      },
    });
    render(<FreezeSection memberId={1} onChanged={() => {}} />);
    await screen.findByText('Te quedan 2 días para congelar este año.');

    fillAndSubmit('2026-12-01', '2026-12-03');

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Solo te quedan 2 días para congelar en 2026.',
    );
  });

  it('EC-13: sin conexión, avisa y conserva lo escrito', async () => {
    mockFetch({
      'GET /api/members/1/freezes': listOf(7, []),
      'POST /api/members/1/freezes': { networkError: true },
    });
    render(<FreezeSection memberId={1} onChanged={() => {}} />);
    await screen.findByText('No tienes ninguna congelación.');

    fillAndSubmit('2026-11-25', '2026-11-26');

    expect((await screen.findByRole('alert')).textContent).toBe(FREEZE_OFFLINE);
    expect(screen.getByLabelText<HTMLInputElement>('Hasta').value).toBe('2026-11-26');
  });

  it('EC-16: "Congelar" se deshabilita mientras se envía (un solo POST)', async () => {
    const fetchMock = mockFetch({
      'GET /api/members/1/freezes': listOf(7, []),
      'POST /api/members/1/freezes': { hang: true },
    });
    render(<FreezeSection memberId={1} onChanged={() => {}} />);
    await screen.findByText('No tienes ninguna congelación.');

    fillAndSubmit('2026-11-25', '2026-11-26');
    fireEvent.click(screen.getByRole('button', { name: 'Congelar' }));

    await waitFor(() =>
      expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Congelar' }).disabled).toBe(
        true,
      ),
    );
    expect(fetchMock.calls.filter((c) => c.method === 'POST')).toHaveLength(1);
  });

  it('CA-07: cancela una futura, avisa y el cupo vuelve', async () => {
    let cancelled = false;
    mockFetch({
      'GET /api/members/1/freezes': () =>
        cancelled ? listOf(7, []) : listOf(5, [freeze(2, '2026-11-25', '2026-11-26')]),
      'DELETE /api/members/1/freezes/2': () => {
        cancelled = true;
        return {
          status: 200,
          json: {
            freeze: {
              ...freeze(2, '2026-11-25', '2026-11-26'),
              cancelledAt: '2026-11-18T11:00:00.000Z',
            },
            remainingDays: 7,
          },
        };
      },
    });
    render(<FreezeSection memberId={1} onChanged={() => {}} />);

    fireEvent.click(await screen.findByRole('button', { name: /^Cancelar/ }));

    expect(await screen.findByText('Congelación cancelada.')).toBeDefined();
    expect(await screen.findByText('Te quedan 7 días para congelar este año.')).toBeDefined();
  });

  it('no hay ningún campo de motivo (RNF-04)', async () => {
    mockFetch({ 'GET /api/members/1/freezes': listOf(7, []) });

    render(<FreezeSection memberId={1} onChanged={() => {}} />);
    await screen.findByText('No tienes ninguna congelación.');

    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    expect(document.querySelectorAll('textarea, input:not([type="date"])')).toHaveLength(0);
    expect(screen.queryByLabelText(/motivo/i)).toBeNull();
  });
});
