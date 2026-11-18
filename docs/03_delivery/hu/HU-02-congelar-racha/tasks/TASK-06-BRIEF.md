# Brief de implementación: HU-02 · TASK-06

> Lo prepara `/implementar-hu` antes de lanzar al builder. Con este brief y lo que nombra, el builder no necesita más
> contexto. Plantilla: `docs/_templates/BRIEF-IMPLEMENTACION.template.md`.

## 1. Qué hay que hacer
- **La task es el contrato:** `docs/03_delivery/hu/HU-02-congelar-racha/tasks/TASK-06.md` (criterios de done incluidos).
- **Capa y builder:** `api` → `api-builder`.
- **Diseño:** `docs/03_delivery/hu/HU-02-congelar-racha/plans/TECHNICAL_DOC-backend.md`, secciones "Error paths", "Threat modeling".
- **Criterios que cubre:** EC-05, EC-06, EC-14, EC-15 · RNF-01, RNF-02, RNF-04.
- **Dónde se trabaja:** la raíz del repo, rama `hu/HU-02-congelar-racha` (ya creada; no cambies de rama).
- **Lo que ya está en la rama:** TASK-01 a TASK-04.
- **Lee solo lo que la task nombra.**

## 2. Invariantes que aplican
- [x] **Decisiones:** DEC-06, DEC-07, DEC-08.
- [x] **Envelope de error** `{ error: { code, message, details? } }` con códigos estables; nunca *stack traces*.
- [x] **Validación con el JSON Schema de Fastify** en cada ruta (params y respuesta).
- [x] **SQLite parametrizado**: siempre `db.prepare(…).run/get/all(params)`.
- [ ] **Migraciones**: no hay migración en esta task.
- [x] **Datos personales** (docs/RGPD.md): el motivo de prueba es inventado y nunca se guarda.
- [ ] **Accesibilidad** (web): roles y nombres accesibles, `role="status"`/`role="alert"`, estados de carga, vacío y error.
- [x] **Caracteres crudos**: nunca NUL ni U+2028/U+2029 en el código.
- [x] **Reuso obligatorio**:
      `failWrites` de `apps/api/test/helpers/test-app.ts`.

## 3. Prohibiciones
- [x] **El builder no hace commit**: deja los cambios en el árbol; la sesión integra, verifica y comitea.
- [x] **No arregles bugs fuera de alcance: repórtalos.**
- [x] **Nunca** `git add -A`, `git add .`, `git stash`, `git push` ni cambios de rama.
- [x] **No toques ficheros que no estén en "Archivos afectados"** sin decirlo en el informe.
- [x] **No instales dependencias.** Nada de red; datos inventados.
- [x] **No ejecutes la suite completa**: tests acotados a tus ficheros.

## 4. Verificación que debes PEGAR en tu informe (salida real, no un resumen)
- [x] `npm test -w apps/api -- attendance/freeze-adversarial.test`: 1 fichero(s) de test.
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
$ npm test -w apps/api -- attendance/freeze-adversarial.test
 Test Files  1 passed (1)
      Tests  6 passed (6)

$ npm run typecheck
(exit 0)

$ npx eslint apps/api/test/attendance/freeze-adversarial.test.ts
(exit 0, sin salida)
```

- **Resultado:** verde, sin ciclos de arreglo (0/2). Ningún caso adversarial rompió el código.
- **Commit:** el de esta task, `test(api): adversarial freeze cases [HU-02 TASK-06]`.

### Corrección tras la review (ronda 1)
La review de HU-02 (ronda 1, `review/REVIEW-ronda-1.md`) vio que el test "EC-15: entradas hostiles: cuerpo no JSON,
vacío o un array" no enviaba ningún cuerpo que no fuera JSON. Nace en la ejecución de esta task, así que se arregla
aquí: el test se renombra a lo que de verdad comprueba y se añade otro que envía un JSON roto con
`content-type: application/json` y un texto plano.

```
$ npm test -w apps/api -- attendance/freeze-adversarial.test
 Test Files  1 passed (1)
      Tests  7 passed (7)

$ npx eslint apps/api/test/attendance/freeze-adversarial.test.ts
(exit 0, sin salida)
```

- **Commit:** `test(api): really send a non-JSON body (review finding) [HU-02 TASK-06]`.
