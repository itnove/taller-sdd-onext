# TASK-02: Crear y listar congelaciones (migración 002)

## Metadata
- **HU:** HU-02 · **Feature:** FEAT-02
- **Scope:** backend
- **Capa:** api: builder `api-builder`
- **Estado:** Pendiente
- **Complejidad:** M (1–2 h)

## Descripción
Migración `002-create-freezes.sql`, repositorio de `freezes`, `freeze-service.ts` (crear y listar en una transacción sin `await`), `freeze-routes.ts` con `POST` y `GET /api/members/:id/freezes` y su registro en `app.ts`.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/api/src/db/migrations/002-create-freezes.sql` | crear |
| `apps/api/src/modules/attendance/repository.ts` | modificar |
| `apps/api/src/modules/attendance/freeze-service.ts` | crear |
| `apps/api/src/modules/attendance/freeze-routes.ts` | crear |
| `apps/api/src/modules/attendance/schemas.ts` | modificar |
| `apps/api/src/app.ts` | modificar |
| `apps/api/test/attendance/freeze-api.test.ts` | crear |

## Implementa
- RF-01 · CA-01, CA-02, CA-03, CA-04 · EC-01, EC-02, EC-03, EC-16
- Diseño: `plans/TECHNICAL_DOC-backend.md` § "Contrato de API", "Migración de datos", "Diagrama de secuencia", "DD-04"

## Dependencias
- **Depende de:** TASK-01
- **Bloquea:** TASK-03, TASK-04, TASK-05

## Criterios de done
- [ ] CA-04: 201 con la congelación y `remainingDays` del año del inicio; aparece en `GET`.
- [ ] CA-01: 400 `VALIDATION_ERROR` con `details[].field`.
- [ ] CA-02: 409 `FREEZE_QUOTA_EXCEEDED` con `remainingDays`.
- [ ] CA-03 y EC-16: 409 `FREEZE_OVERLAP`.
- [ ] La congelación no lleva `memberId` ni nombre.
- [ ] `npm test -w apps/api -- attendance/freeze-api.test` en verde, con 1 fichero(s) de test.
- [ ] `npm run typecheck` sin errores.
- [ ] `npx eslint <ficheros tocados>` sin errores.
- [ ] Commit único `feat(api): create and list freezes (migration 002) [HU-02 TASK-02]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
