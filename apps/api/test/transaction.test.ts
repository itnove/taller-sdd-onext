import { describe, expect, it } from 'vitest';
import { openDatabase } from '../src/db/connection.ts';
import { withTransaction } from '../src/db/transaction.ts';
import { failWrites } from './helpers/test-app.ts';

describe('withTransaction', () => {
  it('deshace todo si una escritura falla a mitad', () => {
    const db = openDatabase(':memory:');
    db.exec('CREATE TABLE notes (id INTEGER PRIMARY KEY, text TEXT NOT NULL)');
    db.exec('CREATE TABLE marks (id INTEGER PRIMARY KEY)');
    failWrites(db, 'INSERT', 'marks');

    expect(() =>
      withTransaction(db, () => {
        db.prepare('INSERT INTO notes (text) VALUES (?)').run('una');
        db.prepare('INSERT INTO marks DEFAULT VALUES').run();
      }),
    ).toThrow('fallo simulado');

    expect(db.prepare('SELECT COUNT(*) AS n FROM notes').get()).toEqual({ n: 0 });
    db.close();
  });
});
