import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

/** data/gymapp.db en la raíz del repo. Se puede cambiar con GYMAPP_DB_PATH (los tests usan ':memory:'). */
export const DEFAULT_DB_PATH = fileURLToPath(
  new URL('../../../../data/gymapp.db', import.meta.url),
);

export function openDatabase(
  path: string = process.env.GYMAPP_DB_PATH ?? DEFAULT_DB_PATH,
): DatabaseSync {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON;');
  if (path !== ':memory:') db.exec('PRAGMA journal_mode = WAL;');
  return db;
}
