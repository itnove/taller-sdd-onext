# Brief de implementación: HU-02 · TASK-01

> Lo prepara `/implementar-hu` antes de lanzar al builder. Con este brief y lo que nombra, el builder no necesita más
> contexto. Plantilla: `docs/_templates/BRIEF-IMPLEMENTACION.template.md`.

## 1. Qué hay que hacer
- **La task es el contrato:** `docs/03_delivery/hu/HU-02-congelar-racha/tasks/TASK-01.md` (criterios de done incluidos).
- **Capa y builder:** `api` → `api-builder`.
- **Diseño:** `docs/03_delivery/hu/HU-02-congelar-racha/plans/TECHNICAL_DOC-backend.md`, secciones "Enfoque técnico", "Contrato de API" (mensajes), "DD-02".
- **Criterios que cubre:** RF-01, RF-03 · CA-01, CA-02, CA-03, CA-04, CA-07, CA-08 · EC-01, EC-02, EC-03, EC-04.
- **Dónde se trabaja:** la raíz del repo, rama `hu/HU-02-congelar-racha` (ya creada; no cambies de rama).
- **Lo que ya está en la rama:** HU-01 en `main` (`computeStreak`, `madridDay`, `addDays`, `isCalendarDate`).
- **Lee solo lo que la task nombra.**

## 2. Invariantes que aplican
- [x] **Decisiones:** DEC-07 (días de Madrid; "hoy" como parámetro), DEC-08 (reglas puras).
- [x] **Envelope de error** `{ error: { code, message, details? } }` con códigos estables; nunca *stack traces*.
- [x] **Validación con el JSON Schema de Fastify** en cada ruta (params y respuesta).
- [x] **SQLite parametrizado**: siempre `db.prepare(…).run/get/all(params)`.
- [ ] **Migraciones**: no hay migración en esta task.
- [x] **Datos personales** (docs/RGPD.md): las reglas no saben de quién son las fechas; sin motivo.
- [ ] **Accesibilidad** (web): roles y nombres accesibles, `role="status"`/`role="alert"`, estados de carga, vacío y error.
- [x] **Caracteres crudos**: nunca NUL ni U+2028/U+2029 en el código.
- [x] **Reuso obligatorio**:
      `addDays` e `isCalendarDate` de `apps/api/src/calendar.ts`.

## 3. Prohibiciones
- [x] **El builder no hace commit**: deja los cambios en el árbol; la sesión integra, verifica y comitea.
- [x] **No arregles bugs fuera de alcance: repórtalos.**
- [x] **Nunca** `git add -A`, `git add .`, `git stash`, `git push` ni cambios de rama.
- [x] **No toques ficheros que no estén en "Archivos afectados"** sin decirlo en el informe.
- [x] **No instales dependencias.** Nada de red; datos inventados.
- [x] **No ejecutes la suite completa**: tests acotados a tus ficheros.

## 4. Verificación que debes PEGAR en tu informe (salida real, no un resumen)
- [x] `npm test -w apps/api -- attendance/freeze-rules.test`: 1 fichero(s) de test.
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
$ npm test -w apps/api -- attendance/freeze-rules.test
 Test Files  1 passed (1)
      Tests  17 passed (17)

$ npm run typecheck
(exit 0)

$ npx eslint apps/api/src/modules/attendance/freeze-rules.ts apps/api/test/attendance/freeze-rules.test.ts
(exit 0, sin salida)
```

- **Resultado:** verde en el ciclo 1/2. En la primera vuelta, el builder acotó el recorrido del cupo a 8 días para no recorrer rangos enormes; al leer el informe, la sesión vio que así un rango largo que cruza de año (del 28/12 al 10/01) pasaba el cupo aunque en 2027 tuviera 10 días. Volvió al builder con ese caso como test (`freeze-rules.test.ts`, "un rango largo que cruza de año"): ahora recorre como mucho 367 días.
- **Commit:** el de esta task, `feat(api): freeze rules [HU-02 TASK-01]`.
- **APRENDIZAJE:** un atajo de rendimiento en una regla de negocio necesita su propio test de frontera: el de 8 días era correcto para un año y falso al cruzar de año.
