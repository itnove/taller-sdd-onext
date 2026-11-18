# Módulo `asistencia` (código `attendance`): Técnico

Foto técnica para los architects, sincronizada hasta **HU-01** (2026-11-17). Lo mantiene `/module-sync`; lo funcional
está en [functional.md](functional.md).

## Estructura de código

| Pieza | Fichero |
|---|---|
| Rutas y JSON Schema | `apps/api/src/modules/attendance/routes.ts`, `apps/api/src/modules/attendance/schemas.ts` |
| Reglas (sin HTTP) | `apps/api/src/modules/attendance/service.ts` |
| Cálculo de la racha (puro) | `apps/api/src/modules/attendance/streak.ts` |
| SQL | `apps/api/src/modules/attendance/repository.ts` |
| Web: pantalla y check-in | `apps/web/src/features/attendance/AttendanceScreen.tsx`, `CheckInButton.tsx` |
| Web: racha | `apps/web/src/features/attendance/StreakPanel.tsx`, `streak-view.ts` (vista pura), `streak-cache.ts` |
| Web: cliente y tipos | `apps/web/src/features/attendance/api.ts`, `types.ts` |

## Tablas y migraciones

| Tabla | Migración | Columnas |
|---|---|---|
| `members` | `001-create-members-and-check-ins.sql` | `id`, `name` (1-60) |
| `check_ins` | `001-create-members-and-check-ins.sql` | `id`, `member_id` (FK), `day` `AAAA-MM-DD` de Madrid, `created_at` ISO UTC; índice `(member_id, day)`, sin `UNIQUE` (duplicados antiguos) |

## Endpoints

| Método y ruta | Respuesta |
|---|---|
| `GET /api/health` | `{ status: "ok" }` (transversal) |
| `GET /api/members` | `{ members: [{ id, name }] }`, por nombre |
| `POST /api/members/:id/checkins` | 200 `{ day, counted }` · 404 `MEMBER_NOT_FOUND` · 400 `VALIDATION_ERROR` |
| `GET /api/members/:id/streak` | 200 `{ memberId, today, days, congratulate }` · 404 `MEMBER_NOT_FOUND` · 400 `VALIDATION_ERROR` |

## Convenciones

- Todo cálculo con días recibe "hoy" como parámetro (`computeStreak(días, today)`); el servicio lo saca de
  `madridDay(now())` (DEC-07).
- Leer, validar y escribir dentro de `withTransaction`, sin `await` en medio (DEC-08).
- La web guarda en `localStorage` solo `{ today, days, congratulate }` con la clave `gymapp:streak:<id>` (RGPD §6).

## Gotchas

- La primera petición de `app.inject` compila los schemas: una medida de tiempo se toma tras un calentamiento
  (HU-01 TASK-02).
- `failWrites` solo rompe escrituras; un fallo de lectura se simula renombrando la tabla (HU-01 TASK-05).
- Con `eslint-plugin-react-hooks` 7, el estado previo a una carga se pone en el manejador que la dispara, no al
  principio del efecto (sprint-01, T-02).

## Seed (`npm run db:reset`)

Relativo al día del reset: Lucía con 5 días, Tomás sin check-ins, Irene con 6 días hasta ayer (su check-in de hoy la
lleva a 7) y Pau con 120.
