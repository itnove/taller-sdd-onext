import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createTestApp } from './helpers/test-app.ts';

describe('GET /api/health', () => {
  let app: FastifyInstance;

  afterEach(async () => {
    await app.close();
  });

  it('responde 200 con { status: "ok" }', async () => {
    ({ app } = createTestApp());

    const response = await app.inject({ method: 'GET', url: '/api/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('una ruta que no existe responde 404 con el envelope de error', async () => {
    ({ app } = createTestApp());

    const response = await app.inject({ method: 'GET', url: '/api/no-existe' });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: { code: 'NOT_FOUND', message: 'El recurso no existe.' },
    });
  });

  it('rechaza con 403 una escritura que llega desde otro sitio', async () => {
    ({ app } = createTestApp());

    const response = await app.inject({
      method: 'POST',
      url: '/api/health',
      headers: { 'sec-fetch-site': 'cross-site' },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json<{ error: { code: string } }>().error.code).toBe('CROSS_SITE_REQUEST');
  });
});
