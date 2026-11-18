# TASK-07: Recorrido de la congelación en el navegador [e2e]

## Metadata
- **HU:** HU-02 · **Feature:** FEAT-02
- **Scope:** test
- **Capa:** web: builder `web-builder`
- **Estado:** Completada
- **Complejidad:** S (< 1 h)

## Descripción
Playwright sobre el seed: Lucía congela hoy y mañana y ve el aviso; Tomás congela la semana que viene y la cancela; empezar ayer da error junto a "Desde".

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `e2e/freeze.spec.ts` | crear |

## Implementa
- CA-01, CA-04, CA-07, CA-09
- Diseño: `plans/TECHNICAL_DOC-frontend.md` § "Estrategia de tests"

## Dependencias
- **Depende de:** TASK-05
- **Bloquea:** nada

## Criterios de done
- [x] Lucía: congela hoy-mañana → "Racha congelada hasta el …".
- [x] Tomás: congela la semana que viene → "Cancelar" → la lista vuelve a vacía y el cupo a 7.
- [x] Inicio ayer → error junto a "Desde".
- [x] `npx playwright test e2e/freeze.spec.ts` en verde, con 1 fichero(s) de test.
- [x] `npm run typecheck` sin errores.
- [x] `npx eslint <ficheros tocados>` sin errores.
- [x] Commit único `test(e2e): freeze journey [HU-02 TASK-07]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
