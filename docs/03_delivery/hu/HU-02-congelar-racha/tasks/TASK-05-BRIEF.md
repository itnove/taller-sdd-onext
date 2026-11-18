# Brief de implementación: HU-02 · TASK-05

> Lo prepara `/implementar-hu` antes de lanzar al builder. Con este brief y lo que nombra, el builder no necesita más
> contexto. Plantilla: `docs/_templates/BRIEF-IMPLEMENTACION.template.md`.

## 1. Qué hay que hacer
- **La task es el contrato:** `docs/03_delivery/hu/HU-02-congelar-racha/tasks/TASK-05.md` (criterios de done incluidos).
- **Capa y builder:** `web` → `web-builder`.
- **Diseño:** `docs/03_delivery/hu/HU-02-congelar-racha/plans/TECHNICAL_DOC-frontend.md`, secciones "Pantallas y estados", "DD-05", "DD-06".
- **Criterios que cubre:** RF-04 · CA-09 · EC-13, EC-16 · RNF-03, RNF-04.
- **Dónde se trabaja:** la raíz del repo, rama `hu/HU-02-congelar-racha` (ya creada; no cambies de rama).
- **Lo que ya está en la rama:** TASK-01 a TASK-04 (la API completa).
- **Lee solo lo que la task nombra.**

## 2. Invariantes que aplican
- [x] **Decisiones:** DEC-06 (`details` y `extra` de `ApiError`), DEC-07 (la web no decide "hoy").
- [ ] **Envelope de error** `{ error: { code, message, details? } }` con códigos estables; nunca *stack traces*.
- [ ] **Validación con el JSON Schema de Fastify** en cada ruta (params y respuesta).
- [ ] **SQLite parametrizado**: siempre `db.prepare(…).run/get/all(params)`.
- [ ] **Migraciones**: no hay migración en esta task.
- [x] **Datos personales** (docs/RGPD.md): sin campo de motivo; nada nuevo en `localStorage`.
- [x] **Accesibilidad** (web): roles y nombres accesibles, `role="status"`/`role="alert"`, estados de carga, vacío y error.
- [x] **Caracteres crudos**: nunca NUL ni U+2028/U+2029 en el código.
- [x] **Reuso obligatorio**:
      `requestJson`, `ApiError`, `isOffline`, `userMessage` de `apps/web/src/components/http.ts`.
      `formatCalendarDate` de `apps/web/src/components/format.ts`; `LoadingMessage`, `ErrorMessage`, `Notice`.

## 3. Prohibiciones
- [x] **El builder no hace commit**: deja los cambios en el árbol; la sesión integra, verifica y comitea.
- [x] **No arregles bugs fuera de alcance: repórtalos.**
- [x] **Nunca** `git add -A`, `git add .`, `git stash`, `git push` ni cambios de rama.
- [x] **No toques ficheros que no estén en "Archivos afectados"** sin decirlo en el informe.
- [x] **No instales dependencias.** Nada de red; datos inventados.
- [x] **No ejecutes la suite completa**: tests acotados a tus ficheros.

## 4. Verificación que debes PEGAR en tu informe (salida real, no un resumen)
- [x] `npm test -w apps/web -- attendance`: 6 fichero(s) de test.
- [x] `npm run typecheck`.
- [x] `npx eslint <ficheros tocados>`.
- [ ] `npx playwright test` (no aplica en esta task).
- [x] Los **criterios de done de la task, uno a uno, con su evidencia**.

## 5. Permiso explícito para pararse
> Si te falta algo, si este brief contradice la task o el diseño, si necesitarías instalar una dependencia o si el reuso
> obligatorio no existe → **dilo y devuelve lo que tengas**.

## 6. Aprendizaje
> Lo no obvio y duradero, en un bloque `APRENDIZAJE` al final del informe.

## 7. Resultado de la integración
> La rellena `/implementar-hu` con la **salida real** de los comandos que ejecuta la sesión. Ciclo de arreglo: 1/2.

```
# Ciclo 0 (rojo)
$ npm run typecheck
src/features/attendance/streak-view.ts(37,5): error TS2741: Property 'frozen' is missing in type
'{ state: "offline"; number: string; label: string; message: string; notice: string; }' but required in type 'StreakView'.
$ npx eslint apps/web
apps/web/src/features/attendance/FreezeForm.tsx
  57:8  error  Function 'FreezeForm' has too many lines (51). Maximum allowed is 50  max-lines-per-function

# Ciclo 1 (verde)
$ npm test -w apps/web -- attendance
 Test Files  5 passed (5)
      Tests  33 passed (33)

$ npm run typecheck
(exit 0)

$ npx eslint apps/web
(exit 0, sin salida)
```

- **Resultado:** verde en el ciclo 1/2. La primera integración dio rojo por dos motivos: `streakView` no devolvía el campo nuevo `frozen` en sus tres ramas (typecheck) y `FreezeForm` pasaba de 50 líneas (lint). Vuelta al builder: rellenó `frozen` y separó el estado del formulario en `useFreezeForm`. Fuera de "Archivos afectados", actualizó los `mockFetch` de `App.test.tsx` y `AttendanceScreen.test.tsx` (la pantalla ahora pide también `/freezes`) y lo dijo en el informe. Son 5 ficheros de test de `attendance`, no 6: `StreakPanel.test.tsx` y `streak-view.test.ts` ya existían.
- **Commit:** el de esta task, `feat(web): freeze form, list and frozen notice [HU-02 TASK-05]`.
- **APRENDIZAJE:** el umbral de 50 líneas por función (QUALITY-GATES §2) se cumple sacando el estado del formulario a un hook (`useFreezeForm`), no partiendo el JSX.
