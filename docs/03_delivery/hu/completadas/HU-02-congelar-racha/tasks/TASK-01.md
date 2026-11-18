# TASK-01: Reglas de la congelación (funciones puras)

## Metadata
- **HU:** HU-02 · **Feature:** FEAT-02
- **Scope:** backend
- **Capa:** api: builder `api-builder`
- **Estado:** Completada
- **Complejidad:** M (1–2 h)

## Descripción
`freeze-rules.ts`: `MAX_FROZEN_DAYS_PER_YEAR`, `daysOf`, `remainingDays`, `validateFreeze(entrada, activas, hoy)`, `checkCancel(congelación, hoy)`, `frozenDaySet` y `frozenUntil`. Sin HTTP ni base de datos.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/api/src/modules/attendance/freeze-rules.ts` | crear |
| `apps/api/test/attendance/freeze-rules.test.ts` | crear |

## Implementa
- RF-01, RF-03 · CA-01, CA-02, CA-03, CA-04, CA-07, CA-08 · EC-01, EC-02, EC-03, EC-04
- Diseño: `plans/TECHNICAL_DOC-backend.md` § "Enfoque técnico", "Contrato de API" (mensajes), "DD-02"

## Dependencias
- **Depende de:** nada
- **Bloquea:** TASK-02, TASK-03, TASK-04

## Criterios de done
- [x] CA-01: día que no existe, otro formato, inicio antes de hoy o fin antes del inicio → error del campo.
- [x] CA-02 y EC-03: 7 días en el año valen; 8 no, con `remainingDays`.
- [x] EC-04: del 30/12 al 02/01 cuenta 2 y 2.
- [x] CA-03: un día compartido con una activa → solape; con una cancelada, no.
- [x] CA-07 y CA-08: `checkCancel` solo deja cancelar si `start > hoy`.
- [x] `npm test -w apps/api -- attendance/freeze-rules.test` en verde, con 1 fichero(s) de test.
- [x] `npm run typecheck` sin errores.
- [x] `npx eslint <ficheros tocados>` sin errores.
- [x] Commit único `feat(api): freeze rules [HU-02 TASK-01]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
