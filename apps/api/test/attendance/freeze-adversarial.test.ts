import type { FastifyInstance } from 'fastify';
import type { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addDays } from '../../src/calendar.ts';
import { createTestApp, createTestClock, failWrites, type TestClock } from '../helpers/test-app.ts';

describe('congelación: casos adversariales (HU-02 TASK-06)', () => {
  let app: FastifyInstance;
  let db: DatabaseSync;
  let clock: TestClock;

  beforeEach(() => {
    clock = createTestClock('2026-11-18T10:00:00.000Z');
    ({ app, db } = createTestApp({ now: clock.now }));
    db.prepare("INSERT INTO members (name) VALUES ('Irene Soler')").run();
  });

  afterEach(async () => {
    await app.close();
  });

  const create = (payload: unknown) =>
    app.inject({ method: 'POST', url: '/api/members/1/freezes', payload: payload as object });
  const count = () => db.prepare('SELECT COUNT(*) AS n FROM freezes').get()?.n;

  it('EC-05: dos congelaciones solapadas enviadas a la vez: entra una y la otra da 409', async () => {
    const [a, b] = await Promise.all([
      create({ start: '2026-11-20', end: '2026-11-22' }),
      create({ start: '2026-11-21', end: '2026-11-23' }),
    ]);

    expect([a.statusCode, b.statusCode].sort()).toEqual([201, 409]);
    expect(count()).toBe(1);
  });

  it('EC-06: si la base falla al guardar, 500 sin datos y nada a medias', async () => {
    failWrites(db, 'INSERT', 'freezes');

    const response = await create({ start: '2026-11-20', end: '2026-11-22' });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: { code: 'INTERNAL_ERROR', message: 'Error interno. Inténtalo de nuevo.' },
    });
    expect(count()).toBe(0);
  });

  it('EC-14: un campo de motivo da 400 y no se guarda nada (RNF-04, RGPD §2)', async () => {
    const response = await create({
      start: '2026-11-20',
      end: '2026-11-22',
      reason: 'lesión de rodilla',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json<{ error: { code: string } }>().error.code).toBe('VALIDATION_ERROR');
    expect(response.body).not.toContain('rodilla');
    expect(count()).toBe(0);
  });

  it('EC-15: cuerpos JSON hostiles (vacío, un array, números) dan 400', async () => {
    for (const payload of [{}, [], { start: 20261120, end: 20261122 }]) {
      const response = await create(payload);

      expect(response.statusCode).toBe(400);
      expect(response.json<{ error: { code: string } }>().error.code).toBe('VALIDATION_ERROR');
    }
    expect(count()).toBe(0);
  });

  it('EC-15: un cuerpo que no es JSON (con content-type JSON o de texto) da 400', async () => {
    for (const [contentType, payload] of [
      ['application/json', '{"start": "2026-11-20", "end": '],
      ['text/plain', 'del 20 al 22 de noviembre'],
    ]) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/members/1/freezes',
        headers: { 'content-type': contentType },
        payload,
      });

      expect(response.statusCode).toBe(400);
      expect(response.json<{ error: { code: string } }>().error.code).toBe('VALIDATION_ERROR');
    }
    expect(count()).toBe(0);
  });

  it('RNF-02: a las 23:30 UTC de invierno, "hoy" ya es el día siguiente en Madrid', async () => {
    clock.set('2026-11-18T23:30:00.000Z');

    const utcDay = await create({ start: '2026-11-18', end: '2026-11-19' });
    const madridDay = await create({ start: '2026-11-19', end: '2026-11-19' });

    expect(utcDay.statusCode).toBe(400);
    expect(madridDay.statusCode).toBe(201);
  });

  it('RNF-01: la racha responde en menos de 300 ms con 400 check-ins y 20 congelaciones', async () => {
    const checkIn = db.prepare(
      "INSERT INTO check_ins (member_id, day, created_at) VALUES (1, ?, '2026-11-01T10:00:00.000Z')",
    );
    for (let i = 0; i < 400; i++) checkIn.run(addDays('2026-11-17', -i));
    const freeze = db.prepare(
      "INSERT INTO freezes (member_id, start_day, end_day, created_at) VALUES (1, ?, ?, '2026-11-01T10:00:00.000Z')",
    );
    for (let i = 0; i < 20; i++)
      freeze.run(addDays('2025-01-01', i * 3), addDays('2025-01-01', i * 3));
    await app.inject({ method: 'GET', url: '/api/members/1/streak' }); // calentamiento

    const start = performance.now();
    const response = await app.inject({ method: 'GET', url: '/api/members/1/streak' });

    expect(response.statusCode).toBe(200);
    expect(performance.now() - start).toBeLessThan(300);
  });
});
