# Módulo `asistencia` (código `attendance`): Técnico

Foto técnica para los architects, sincronizada hasta **HU-02** (2026-11-18). Lo mantiene `/module-sync`; lo funcional
está en [functional.md](functional.md).

## Estructura de código

| Pieza | Fichero |
|---|---|
| Rutas y JSON Schema | `apps/api/src/modules/attendance/routes.ts`, `apps/api/src/modules/attendance/schemas.ts` |
| Reglas (sin HTTP) | `apps/api/src/modules/attendance/service.ts` |
| Cálculo de la racha (puro) | `apps/api/src/modules/attendance/streak.ts` |
| Reglas de la congelación (puras) | `apps/api/src/modules/attendance/freeze-rules.ts` |
| Congelaciones: servicio y rutas | `apps/api/src/modules/attendance/freeze-service.ts`, `apps/api/src/modules/attendance/freeze-routes.ts` |
| SQL | `apps/api/src/modules/attendance/repository.ts` |
| Web: pantalla y check-in | `apps/web/src/features/attendance/AttendanceScreen.tsx`, `CheckInButton.tsx` |
| Web: racha | `apps/web/src/features/attendance/StreakPanel.tsx`, `streak-view.ts` (vista pura), `streak-cache.ts` |
| Web: congelar | `apps/web/src/features/attendance/FreezeSection.tsx`, `FreezeForm.tsx`, `FreezeList.tsx`, `freeze-api.ts` |
| Web: cliente y tipos | `apps/web/src/features/attendance/api.ts`, `types.ts` |

## Tablas y migraciones

| Tabla | Migración | Columnas |
|---|---|---|
| `members` | `001-create-members-and-check-ins.sql` | `id`, `name` (1-60) |
| `check_ins` | `001-create-members-and-check-ins.sql` | `id`, `member_id` (FK), `day` `AAAA-MM-DD` de Madrid, `created_at` ISO UTC; índice `(member_id, day)`, sin `UNIQUE` (duplicados antiguos) |
| `freezes` | `002-create-freezes.sql` | `id`, `member_id` (FK), `start_day` y `end_day` (`CHECK end_day >= start_day`), `created_at`, `cancelled_at` (nulo si activa); índice `(member_id, start_day)`; sin columna de motivo |

## Endpoints

| Método y ruta | Respuesta |
|---|---|
| `GET /api/health` | `{ status: "ok" }` (transversal) |
| `GET /api/members` | `{ members: [{ id, name }] }`, por nombre |
| `POST /api/members/:id/checkins` | 200 `{ day, counted }` · 404 `MEMBER_NOT_FOUND` · 400 `VALIDATION_ERROR` |
| `GET /api/members/:id/streak` | 200 `{ memberId, today, days, congratulate, frozenUntil }` · 404 `MEMBER_NOT_FOUND` · 400 `VALIDATION_ERROR` |
| `GET /api/members/:id/freezes` | 200 `{ today, remainingDays, freezes }` (activas, por inicio; cupo del año de hoy) |
| `POST /api/members/:id/freezes` | 201 `{ freeze, remainingDays }` · 400 `VALIDATION_ERROR` con `details[].field` · 409 `FREEZE_QUOTA_EXCEEDED` con `remainingDays` · 409 `FREEZE_OVERLAP` |
| `DELETE /api/members/:id/freezes/:freezeId` | 200 `{ freeze, remainingDays }` · 409 `FREEZE_ALREADY_STARTED` · 409 `FREEZE_ALREADY_CANCELLED` · 404 `FREEZE_NOT_FOUND` |

## Convenciones

- Todo cálculo con días recibe "hoy" como parámetro (`computeStreak(días, today)`); el servicio lo saca de
  `madridDay(now())` (DEC-07).
- Leer, validar y escribir dentro de `withTransaction`, sin `await` en medio (DEC-08): así dos congelaciones solapadas
  enviadas a la vez no entran las dos (HU-02, EC-05).
- Las reglas de negocio con fechas son funciones puras (`freeze-rules.ts`, `streak.ts`); el servicio traduce sus
  errores a `AppError` y las rutas solo hablan HTTP.
- La web guarda en `localStorage` solo `{ today, days, congratulate }` con la clave `gymapp:streak:<id>` (RGPD §6).

## Gotchas

- La primera petición de `app.inject` compila los schemas: una medida de tiempo se toma tras un calentamiento
  (HU-01 TASK-02).
- `failWrites` solo rompe escrituras; un fallo de lectura se simula renombrando la tabla (HU-01 TASK-05).
- Un atajo de rendimiento en una regla necesita su test de frontera: acotar el cupo a 8 días fallaba al cruzar de año
  (HU-02 TASK-01).
- Un test cuyo nombre promete más de lo que comprueba es un hallazgo de la review (HU-02, ronda 1: EC-15).
- Con `eslint-plugin-react-hooks` 7, el estado previo a una carga se pone en el manejador que la dispara, no al
  principio del efecto (sprint-01, T-02).

## Seed (`npm run db:reset`)

Relativo al día del reset: Lucía con 5 días, Tomás sin check-ins, Irene con 6 días hasta ayer (su check-in de hoy la
lleva a 7) y Pau con 120. Nadie tiene congelaciones.
