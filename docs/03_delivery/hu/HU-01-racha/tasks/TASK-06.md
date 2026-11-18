# TASK-06: Recorrido de la racha en el navegador [e2e]

## Metadata
- **HU:** HU-01 · **Feature:** FEAT-01
- **Scope:** test
- **Capa:** web: builder `web-builder`
- **Estado:** Completada
- **Complejidad:** S (< 1 h)

## Descripción
Playwright sobre el seed: Irene hace check-in y ve 7 días con la felicitación; Pau ve 120; Tomás, "Empieza tu racha hoy".

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `e2e/streak.spec.ts` | crear |

## Implementa
- CA-02, CA-03, CA-04 · EC-06
- Diseño: `plans/TECHNICAL_DOC-frontend.md` § "Estrategia de tests"

## Dependencias
- **Depende de:** TASK-03, TASK-04
- **Bloquea:** nada

## Criterios de done
- [x] Irene: 6 → check-in → 7 y la felicitación.
- [x] Pau: 120.
- [x] Tomás: 0 y "Empieza tu racha hoy".
- [x] `npx playwright test e2e/streak.spec.ts` en verde, con 1 fichero(s) de test.
- [x] `npm run typecheck` sin errores.
- [x] `npx eslint <ficheros tocados>` sin errores.
- [x] Commit único `test(e2e): streak journey [HU-01 TASK-06]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
