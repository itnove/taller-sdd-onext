# Brief de implementación: HU-01 · TASK-01

> Lo prepara `/implementar-hu` antes de lanzar al builder. Con este brief y lo que nombra, el builder no necesita más
> contexto. Plantilla: `docs/_templates/BRIEF-IMPLEMENTACION.template.md`.

## 1. Qué hay que hacer
- **La task es el contrato:** `docs/03_delivery/hu/HU-01-racha/tasks/TASK-01.md` (criterios de done incluidos).
- **Capa y builder:** `api` → `api-builder`.
- **Diseño:** `docs/03_delivery/hu/HU-01-racha/plans/TECHNICAL_DOC-backend.md`, secciones "Enfoque técnico", "DD-01".
- **Criterios que cubre:** RF-01 · CA-01, CA-02, CA-03 · EC-01, EC-03.
- **Dónde se trabaja:** la raíz del repo, rama `hu/HU-01-racha` (ya creada; no cambies de rama).
- **Lo que ya está en la rama:** T-01 y T-02 en `main` (socios, check-ins y `madridDay`/`addDays` en `apps/api/src/calendar.ts`).
- **Lee solo lo que la task nombra.**

## 2. Invariantes que aplican
- [x] **Decisiones:** DEC-07 (los días son texto `AAAA-MM-DD` de Madrid; "hoy" llega como parámetro), DEC-08 (regla pura, sin HTTP ni SQL).
- [x] **Envelope de error** `{ error: { code, message, details? } }` con códigos estables; nunca *stack traces*.
- [x] **Validación con el JSON Schema de Fastify** en cada ruta (params y respuesta).
- [x] **SQLite parametrizado**: siempre `db.prepare(…).run/get/all(params)`.
- [ ] **Migraciones**: no hay migración en esta task.
- [x] **Datos personales** (docs/RGPD.md): la función no sabe de quién son los días.
- [ ] **Accesibilidad** (web): roles y nombres accesibles, `role="status"`/`role="alert"`, estados de carga, vacío y error.
- [x] **Caracteres crudos**: nunca NUL ni U+2028/U+2029 en el código.
- [x] **Reuso obligatorio**:
      `addDays` de `apps/api/src/calendar.ts`.

## 3. Prohibiciones
- [x] **El builder no hace commit**: deja los cambios en el árbol; la sesión integra, verifica y comitea.
- [x] **No arregles bugs fuera de alcance: repórtalos.**
- [x] **Nunca** `git add -A`, `git add .`, `git stash`, `git push` ni cambios de rama.
- [x] **No toques ficheros que no estén en "Archivos afectados"** sin decirlo en el informe.
- [x] **No instales dependencias.** Nada de red; datos inventados.
- [x] **No ejecutes la suite completa**: tests acotados a tus ficheros.

## 4. Verificación que debes PEGAR en tu informe (salida real, no un resumen)
- [x] `npm test -w apps/api -- attendance/streak.test`: 1 fichero(s) de test.
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
> La rellena `/implementar-hu` con la **salida real** de los comandos que ejecuta la sesión. Ciclo de arreglo: 0/2.

```
$ npm test -w apps/api -- attendance/streak.test
 Test Files  1 passed (1)
      Tests  6 passed (6)

$ npm run typecheck
(exit 0)

$ npx eslint apps/api/src/modules/attendance/streak.ts apps/api/test/attendance/streak.test.ts
(exit 0, sin salida)
```

- **Resultado:** verde, sin ciclos de arreglo (0/2).
- **Commit:** el de esta task, `feat(api): compute the attendance streak [HU-01 TASK-01]`.
