-- HU-02 (TASK-02): congelaciones de la racha. Sin columna de motivo ni de texto libre: el motivo puede revelar datos de
-- salud y queda fuera de alcance (docs/RGPD.md §2). Cancelar no borra: marca `cancelled_at` (DD-03).
CREATE TABLE freezes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id    INTEGER NOT NULL REFERENCES members (id),
  start_day    TEXT NOT NULL CHECK (start_day GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  end_day      TEXT NOT NULL CHECK (end_day GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  created_at   TEXT NOT NULL,
  cancelled_at TEXT,
  CHECK (end_day >= start_day)
);

CREATE INDEX freezes_member_start ON freezes (member_id, start_day);
