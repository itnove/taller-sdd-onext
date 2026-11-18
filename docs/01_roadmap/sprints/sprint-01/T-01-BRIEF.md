# Brief de implementación: sprint-01 · T-01 · Socios y check-ins en la API

> Tarea de sprint sin HU (WORKFLOW §9): base del módulo `asistencia`, sin nada que preguntar ni que aceptar. Mismo
> formato que `docs/_templates/BRIEF-IMPLEMENTACION.template.md`.

## 1. Qué hay que hacer
- **Capa y builder:** `api` → `api-builder`.
- **Qué:** migración `001-create-members-and-check-ins.sql` (`members`: `id`, `name`; `check_ins`: `id`, `member_id`
  con FK, `day` `AAAA-MM-DD`, `created_at` ISO UTC; índice por socio y día, **sin** `UNIQUE`: puede haber duplicados
  antiguos y deben contar uno), seed inventado relativo al día del reset (Lucía 5 días hasta hoy, Tomás 0, Irene 6
  hasta ayer, Pau 120 hasta hoy), `GET /api/members` → `{ members: [{ id, name }] }` ordenado por nombre y
  `POST /api/members/:id/checkins` → 200 `{ day, counted }` (`counted: false` si ya había check-in ese día de Madrid,
  sin guardar otro) · 404 `MEMBER_NOT_FOUND`.
- **Dónde:** módulo `apps/api/src/modules/attendance/` (`routes.ts`, `service.ts`, `repository.ts`, `schemas.ts`),
  registrado en `apps/api/src/app.ts` con el reloj inyectado.

## 2. Invariantes que aplican
- [x] **DEC-06:** envelope de error, JSON Schema estricto (`idParamsSchema`), sin cuerpo en el check-in.
- [x] **DEC-07:** el día es `madridDay(now())`; nada de `new Date()` en el servicio.
- [x] **DEC-08:** capas routes → service → repository; leer y escribir el check-in sin `await` en medio.
- [x] **Datos personales:** el listado solo `id` y `name`; nombres inventados.
- [x] **Reuso obligatorio:** `AppError` (`apps/api/src/errors.ts`), `withTransaction`, `createTestApp` y
      `createTestClock` (`apps/api/test/helpers/test-app.ts`).

## 3. Prohibiciones
- [x] Sin commit, sin dependencias nuevas, sin red, sin tocar `apps/web`.

## 4. Verificación
- [x] `npm test -w apps/api`, `npm run typecheck`, `npx eslint apps/api`.

## 7. Resultado de la integración

```
npm test -w apps/api      → Test Files 7 passed (7) · Tests 17 passed (17)
npm run typecheck         → sin errores
npx eslint apps/api       → sin errores
```

- **Resultado:** verde a la primera (ciclo 0/2).
