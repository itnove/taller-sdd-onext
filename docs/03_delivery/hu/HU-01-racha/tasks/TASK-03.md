# TASK-03: Panel de la racha en la web

## Metadata
- **HU:** HU-01 · **Feature:** FEAT-01
- **Scope:** frontend
- **Capa:** web: builder `web-builder`
- **Estado:** Completada
- **Complejidad:** M (1–2 h)

## Descripción
`fetchStreak` en `api.ts`, el tipo `Streak`, la vista pura `streakView` y `StreakPanel`, compuesto en `AttendanceScreen` y refrescado tras cada check-in.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/web/src/features/attendance/types.ts` | modificar |
| `apps/web/src/features/attendance/api.ts` | modificar |
| `apps/web/src/features/attendance/streak-view.ts` | crear |
| `apps/web/src/features/attendance/StreakPanel.tsx` | crear |
| `apps/web/src/features/attendance/AttendanceScreen.tsx` | modificar |
| `apps/web/test/features/attendance/streak-view.test.ts` | crear |
| `apps/web/test/features/attendance/StreakPanel.test.tsx` | crear |

## Implementa
- RF-03 · CA-03, CA-04 · EC-06, EC-07, EC-12
- Diseño: `plans/TECHNICAL_DOC-frontend.md` § "Pantallas y estados", "DD-03"

## Dependencias
- **Depende de:** TASK-02
- **Bloquea:** TASK-04, TASK-06

## Criterios de done
- [x] CA-03: 0 días → "Empieza tu racha hoy".
- [x] CA-04 y EC-07: la felicitación solo con `congratulate`.
- [x] EC-06: "120" con "días seguidos".
- [x] EC-12: una forma inesperada da error con reintento, sin número.
- [x] El panel se refresca tras el check-in.
- [x] `npm test -w apps/web -- attendance` en verde, con 3 fichero(s) de test.
- [x] `npm run typecheck` sin errores.
- [x] `npx eslint <ficheros tocados>` sin errores.
- [x] Commit único `feat(web): streak panel [HU-01 TASK-03]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
