-- T-01 (sprint-01): socios y check-ins del módulo asistencia.
-- `check_ins` no lleva UNIQUE (member_id, day): puede haber duplicados antiguos y la racha los cuenta como uno
-- (FEAT-01, RN-02). El check-in nuevo no duplica: lo comprueba el servicio dentro de la transacción (DEC-08).
CREATE TABLE members (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 60)
);

CREATE TABLE check_ins (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id  INTEGER NOT NULL REFERENCES members (id),
  day        TEXT NOT NULL CHECK (day GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  created_at TEXT NOT NULL
);

CREATE INDEX check_ins_member_day ON check_ins (member_id, day);
