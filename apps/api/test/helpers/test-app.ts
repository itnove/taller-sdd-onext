import type { FastifyInstance } from 'fastify';
import type { DatabaseSync } from 'node:sqlite';
import { buildApp } from '../../src/app.ts';
import type { Clock } from '../../src/clock.ts';
import { openDatabase } from '../../src/db/connection.ts';
import { migrate } from '../../src/db/migrate.ts';

/** App sobre una base `:memory:` migrada. Quien la use cierra con `await app.close()` en `afterEach`. */
export function createTestApp({ now }: { now?: Clock } = {}): {
  app: FastifyInstance;
  db: DatabaseSync;
} {
  const db = openDatabase(':memory:');
  migrate(db);
  const app = buildApp({ db, now });
  return { app, db };
}

export interface TestClock {
  now: Clock;
  set(iso: string): void;
  advance(ms: number): void;
}

/** Reloj controlable para fijar y escalonar fechas (sin `vi.useFakeTimers()`, que congela Fastify). */
export function createTestClock(iso: string): TestClock {
  let current = new Date(iso).getTime();
  return {
    now: () => new Date(current),
    set(next) {
      current = new Date(next).getTime();
    },
    advance(ms) {
      current += ms;
    },
  };
}

export type WriteOperation = 'INSERT' | 'UPDATE' | 'DELETE';

/**
 * Hace fallar las siguientes escrituras `op` en `table` con un error real de SQLite (un trigger con
 * `RAISE(ABORT, 'fallo simulado')`), sin mocks. SQLite no admite parámetros en `CREATE TRIGGER`: el DDL se compone
 * solo con literales del propio test, nunca con entrada externa.
 */
export function failWrites(db: DatabaseSync, op: WriteOperation, table: string): void {
  if (!/^[a-z_]+$/.test(table)) throw new Error('failWrites: nombre de tabla no válido');
  db.exec(
    `CREATE TRIGGER fail_${table}_${op.toLowerCase()} BEFORE ${op} ON ${table} BEGIN SELECT RAISE(ABORT, 'fallo simulado'); END`,
  );
}
