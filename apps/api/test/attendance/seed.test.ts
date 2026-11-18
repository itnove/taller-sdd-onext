import { describe, expect, it } from 'vitest';
import { openDatabase } from '../../src/db/connection.ts';
import { migrate } from '../../src/db/migrate.ts';
import { seed } from '../../src/db/seed.ts';

describe('seed', () => {
  it('crea los cuatro socios con sus check-ins relativos al día del reset', () => {
    const db = openDatabase(':memory:');
    migrate(db);
    seed(db, new Date('2026-11-16T10:00:00.000Z'));

    const rows = db
      .prepare(
        `SELECT m.name AS name, COUNT(c.id) AS n, MIN(c.day) AS first, MAX(c.day) AS last
           FROM members m LEFT JOIN check_ins c ON c.member_id = m.id
          GROUP BY m.id ORDER BY m.id`,
      )
      .all();

    expect(rows).toEqual([
      { name: 'Lucía Ferrer', n: 5, first: '2026-11-12', last: '2026-11-16' },
      { name: 'Tomás Abad', n: 0, first: null, last: null },
      { name: 'Irene Soler', n: 6, first: '2026-11-10', last: '2026-11-15' },
      { name: 'Pau Roig', n: 120, first: '2026-07-20', last: '2026-11-16' },
    ]);
    db.close();
  });
});
