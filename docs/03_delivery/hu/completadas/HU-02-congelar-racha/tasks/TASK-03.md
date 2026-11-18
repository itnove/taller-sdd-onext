# TASK-03: La racha se salta los días congelados

## Metadata
- **HU:** HU-02 · **Feature:** FEAT-02
- **Scope:** backend
- **Capa:** api: builder `api-builder`
- **Estado:** Completada
- **Complejidad:** S (< 1 h)

## Descripción
`computeStreak(días, hoy, congelados)` salta los días congelados sin check-in; la racha devuelve `frozenUntil`. El test de HU-01 que compara la respuesta entera se actualiza.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/api/src/modules/attendance/streak.ts` | modificar |
| `apps/api/src/modules/attendance/service.ts` | modificar |
| `apps/api/src/modules/attendance/schemas.ts` | modificar |
| `apps/api/test/attendance/streak-freeze.test.ts` | crear |
| `apps/api/test/attendance/streak-api.test.ts` | modificar |

## Implementa
- RF-02 · CA-05, CA-06, CA-10 · EC-07, EC-08, EC-09, EC-10 · RNF-01
- Diseño: `plans/TECHNICAL_DOC-backend.md` § "DD-01", segundo diagrama de secuencia

## Dependencias
- **Depende de:** TASK-02
- **Bloquea:** TASK-05

## Criterios de done
- [x] CA-05: racha de 10, una semana congelada sin venir → 10; si viene, 11.
- [x] CA-06: check-in en un día congelado suma.
- [x] CA-10 y EC-09: sin congelaciones, igual que la v1 (los tests de HU-01 siguen en verde).
- [x] EC-07: empieza mañana → `frozenUntil: null`.
- [x] EC-08: un hueco sin congelar rompe.
- [x] EC-10: una cancelada no se salta.
- [x] RNF-01: menos de 300 ms con 400 check-ins y 20 congelaciones.
- [x] `npm test -w apps/api -- attendance/streak` en verde, con 4 fichero(s) de test.
- [x] `npm run typecheck` sin errores.
- [x] `npx eslint <ficheros tocados>` sin errores.
- [x] Commit único `feat(api): streak skips frozen days and returns frozenUntil [HU-02 TASK-03]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
