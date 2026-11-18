# Brief de implementación: HU-01 · TASK-05

> Lo prepara `/implementar-hu` antes de lanzar al builder. Con este brief y lo que nombra, el builder no necesita más
> contexto. Plantilla: `docs/_templates/BRIEF-IMPLEMENTACION.template.md`.

## 1. Qué hay que hacer
- **La task es el contrato:** `docs/03_delivery/hu/HU-01-racha/tasks/TASK-05.md` (criterios de done incluidos).
- **Capa y builder:** `api` → `api-builder`.
- **Diseño:** `docs/03_delivery/hu/HU-01-racha/plans/TECHNICAL_DOC-backend.md`, secciones "Error paths", "Threat modeling".
- **Criterios que cubre:** CA-01 · EC-02, EC-03, EC-10, EC-11 · RNF-02.
- **Dónde se trabaja:** la raíz del repo, rama `hu/HU-01-racha` (ya creada; no cambies de rama).
- **Lo que ya está en la rama:** TASK-01 y TASK-02.
- **Lee solo lo que la task nombra.**

## 2. Invariantes que aplican
- [x] **Decisiones:** DEC-06, DEC-07.
- [x] **Envelope de error** `{ error: { code, message, details? } }` con códigos estables; nunca *stack traces*.
- [x] **Validación con el JSON Schema de Fastify** en cada ruta (params y respuesta).
- [x] **SQLite parametrizado**: siempre `db.prepare(…).run/get/all(params)`.
- [ ] **Migraciones**: no hay migración en esta task.
- [x] **Datos personales** (docs/RGPD.md): datos inventados.
- [ ] **Accesibilidad** (web): roles y nombres accesibles, `role="status"`/`role="alert"`, estados de carga, vacío y error.
- [x] **Caracteres crudos**: nunca NUL ni U+2028/U+2029 en el código.
- [x] **Reuso obligatorio**:
      `createTestApp`, `createTestClock` de `apps/api/test/helpers/test-app.ts`.

## 3. Prohibiciones
- [x] **El builder no hace commit**: deja los cambios en el árbol; la sesión integra, verifica y comitea.
- [x] **No arregles bugs fuera de alcance: repórtalos.**
- [x] **Nunca** `git add -A`, `git add .`, `git stash`, `git push` ni cambios de rama.
- [x] **No toques ficheros que no estén en "Archivos afectados"** sin decirlo en el informe.
- [x] **No instales dependencias.** Nada de red; datos inventados.
- [x] **No ejecutes la suite completa**: tests acotados a tus ficheros.

## 4. Verificación que debes PEGAR en tu informe (salida real, no un resumen)
- [x] `npm test -w apps/api -- attendance/streak-adversarial.test`: 1 fichero(s) de test.
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
> La rellena `/implementar-hu` con la **salida real** de los comandos que ejecuta la sesión. Ciclo de arreglo: -.

_Pendiente de implementar._
