# TASK-01: Cálculo de la racha (función pura)

## Metadata
- **HU:** HU-01 · **Feature:** FEAT-01
- **Scope:** backend
- **Capa:** api: builder `api-builder`
- **Estado:** Pendiente
- **Complejidad:** S (< 1 h)

## Descripción
`computeStreak(checkInDays, today)` y `CONGRATULATE_FROM_DAYS` en `streak.ts`: días seguidos con check-in contando hacia atrás desde hoy; si hoy no hay check-in, desde ayer; los duplicados cuentan uno.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/api/src/modules/attendance/streak.ts` | crear |
| `apps/api/test/attendance/streak.test.ts` | crear |

## Implementa
- RF-01 · CA-01, CA-02, CA-03 · EC-01, EC-03
- Diseño: `plans/TECHNICAL_DOC-backend.md` § "Enfoque técnico", "DD-01"

## Dependencias
- **Depende de:** nada
- **Bloquea:** TASK-02

## Criterios de done
- [ ] CA-01: el resultado es siempre un entero ≥ 0, también sin check-ins.
- [ ] CA-02: 4 días hasta ayer + hoy → 5.
- [ ] CA-03 y EC-01: falta ayer → 0; hoy sin check-in y ayer sí → cuenta desde ayer.
- [ ] EC-03: días duplicados cuentan uno.
- [ ] `npm test -w apps/api -- attendance/streak.test` en verde, con 1 fichero(s) de test.
- [ ] `npm run typecheck` sin errores.
- [ ] `npx eslint <ficheros tocados>` sin errores.
- [ ] Commit único `feat(api): compute the attendance streak [HU-01 TASK-01]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
