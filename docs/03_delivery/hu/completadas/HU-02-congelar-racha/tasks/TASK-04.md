# TASK-04: Cancelar una congelación

## Metadata
- **HU:** HU-02 · **Feature:** FEAT-02
- **Scope:** backend
- **Capa:** api: builder `api-builder`
- **Estado:** Completada
- **Complejidad:** S (< 1 h)

## Descripción
`DELETE /api/members/:id/freezes/:freezeId`: marca `cancelled_at` si aún no ha empezado; 409 si ya empezó o ya estaba cancelada; 404 si no existe o es de otro socio.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/api/src/modules/attendance/repository.ts` | modificar |
| `apps/api/src/modules/attendance/freeze-service.ts` | modificar |
| `apps/api/src/modules/attendance/freeze-routes.ts` | modificar |
| `apps/api/src/modules/attendance/schemas.ts` | modificar |
| `apps/api/test/attendance/freeze-cancel.test.ts` | crear |

## Implementa
- RF-03 · CA-07, CA-08 · EC-11, EC-12
- Diseño: `plans/TECHNICAL_DOC-backend.md` § "Contrato de API", "DD-03"

## Dependencias
- **Depende de:** TASK-02
- **Bloquea:** TASK-05

## Criterios de done
- [x] CA-07: 200, `cancelledAt` puesto y `remainingDays` sube; ya no sale en `GET`.
- [x] CA-08: empezada hoy o antes → 409 `FREEZE_ALREADY_STARTED`.
- [x] EC-11: segunda vez → 409 `FREEZE_ALREADY_CANCELLED`, sin cambios.
- [x] EC-12: de otro socio o inexistente → 404 `FREEZE_NOT_FOUND`.
- [x] `npm test -w apps/api -- attendance/freeze-cancel.test` en verde, con 1 fichero(s) de test.
- [x] `npm run typecheck` sin errores.
- [x] `npx eslint <ficheros tocados>` sin errores.
- [x] Commit único `feat(api): cancel a freeze before it starts [HU-02 TASK-04]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
