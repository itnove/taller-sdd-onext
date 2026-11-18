# TASK-02 · Consulta de la racha: GET /api/members/:id/streak

## Metadata
- **HU:** HU-01 · **Feature:** FEAT-01
- **Scope:** backend
- **Capa:** api: builder `api-builder`
- **Estado:** Completada
- **Complejidad:** M (1–2 h)

## Descripción
`checkInDays` en el repositorio, `getStreak` en el servicio (con `today` de Madrid y `congratulate`) y la ruta con su schema de respuesta de 4 campos.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/api/src/modules/attendance/repository.ts` | modificar |
| `apps/api/src/modules/attendance/service.ts` | modificar |
| `apps/api/src/modules/attendance/schemas.ts` | modificar |
| `apps/api/src/modules/attendance/routes.ts` | modificar |
| `apps/api/test/attendance/streak-api.test.ts` | crear |

## Implementa
- RF-02 · CA-02, CA-04, CA-06 · EC-04, EC-05, EC-07
- Diseño: `plans/TECHNICAL_DOC-backend.md` § "Contrato de API", "Diagrama de secuencia", "DD-02"

## Dependencias
- **Depende de:** TASK-01
- **Bloquea:** TASK-03, TASK-05

## Criterios de done
- [x] CA-02: check-in hoy con 4 días previos → `days: 5`.
- [x] CA-04 y EC-07: 6 días → `congratulate: false`; 7 → `true`.
- [x] CA-06: con 400 check-ins responde en menos de 300 ms.
- [x] EC-04: 404 `MEMBER_NOT_FOUND`.
- [x] EC-05: dos consultas iguales y ninguna escritura.
- [x] La respuesta tiene exactamente `memberId`, `today`, `days` y `congratulate`.
- [x] `npm test -w apps/api -- attendance/streak-api.test` en verde, con 1 fichero(s) de test.
- [x] `npm run typecheck` sin errores.
- [x] `npx eslint <ficheros tocados>` sin errores.
- [x] Commit único `feat(api): streak endpoint with congratulation flag [HU-01 TASK-02]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
