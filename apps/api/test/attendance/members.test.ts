import type { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it } from 'vitest';
import { seed } from '../../src/db/seed.ts';
import { createTestApp, createTestClock } from '../helpers/test-app.ts';

describe('GET /api/members', () => {
  let app: FastifyInstance;

  afterEach(async () => {
    await app.close();
  });

  it('devuelve los socios ordenados por nombre, solo con id y nombre', async () => {
    const { app: created, db } = createTestApp();
    app = created;
    seed(db, new Date('2026-11-16T10:00:00.000Z'));

    const response = await app.inject({ method: 'GET', url: '/api/members' });

    expect(response.statusCode).toBe(200);
    const { members } = response.json<{ members: { id: number; name: string }[] }>();
    expect(members.map((m) => m.name)).toEqual([
      'Irene Soler',
      'Lucía Ferrer',
      'Pau Roig',
      'Tomás Abad',
    ]);
    expect(Object.keys(members[0]!).sort()).toEqual(['id', 'name']);
  });

  it('sin socios devuelve una lista vacía', async () => {
    ({ app } = createTestApp({ now: createTestClock('2026-11-16T10:00:00.000Z').now }));

    const response = await app.inject({ method: 'GET', url: '/api/members' });

    expect(response.json()).toEqual({ members: [] });
  });
});
