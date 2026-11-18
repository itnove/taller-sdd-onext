import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, isOffline, requestJson, userMessage } from '../src/components/http.ts';
import { mockFetch } from './helpers/fetch.ts';

describe('requestJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('devuelve el JSON de una respuesta 2xx', async () => {
    mockFetch({ 'GET /api/health': { status: 200, json: { status: 'ok' } } });

    await expect(requestJson('/api/health')).resolves.toEqual({ status: 'ok' });
  });

  it('convierte el envelope de error en un ApiError con sus campos numéricos extra', async () => {
    mockFetch({
      'POST /api/x': {
        status: 409,
        json: { error: { code: 'QUOTA', message: 'Sin cupo.', remainingDays: 2, note: 'x' } },
      },
    });

    const error = await requestJson('/api/x', { method: 'POST', body: {} }).catch(
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, code: 'QUOTA', extra: { remainingDays: 2 } });
    expect(userMessage(error)).toBe('Sin cupo.');
    expect(isOffline(error)).toBe(false);
  });

  it('sin red da CLIENT_NETWORK y cuenta como sin conexión', async () => {
    mockFetch({ 'GET /api/health': { networkError: true } });

    const error = await requestJson('/api/health').catch((e: unknown) => e);

    expect(error).toMatchObject({ status: 0, code: 'CLIENT_NETWORK' });
    expect(isOffline(error)).toBe(true);
  });
});
