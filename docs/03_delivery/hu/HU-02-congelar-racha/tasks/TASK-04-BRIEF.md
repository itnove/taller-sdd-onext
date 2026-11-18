# Brief de implementación: HU-02 · TASK-04

> Lo prepara `/implementar-hu` antes de lanzar al builder. Con este brief y lo que nombra, el builder no necesita más
> contexto. Plantilla: `docs/_templates/BRIEF-IMPLEMENTACION.template.md`.

## 1. Qué hay que hacer
- **La task es el contrato:** `docs/03_delivery/hu/HU-02-congelar-racha/tasks/TASK-04.md` (criterios de done incluidos).
- **Capa y builder:** `api` → `api-builder`.
- **Diseño:** `docs/03_delivery/hu/HU-02-congelar-racha/plans/TECHNICAL_DOC-backend.md`, secciones "Contrato de API", "DD-03".
- **Criterios que cubre:** RF-03 · CA-07, CA-08 · EC-11, EC-12.
- **Dónde se trabaja:** la raíz del repo, rama `hu/HU-02-congelar-racha` (ya creada; no cambies de rama).
- **Lo que ya está en la rama:** TASK-01 a TASK-03.
- **Lee solo lo que la task nombra.**

## 2. Invariantes que aplican
- [x] **Decisiones:** DEC-04 (de otro socio, 404), DEC-06, DEC-08.
- [x] **Envelope de error** `{ error: { code, message, details? } }` con códigos estables; nunca *stack traces*.
- [x] **Validación con el JSON Schema de Fastify** en cada ruta (params y respuesta).
- [x] **SQLite parametrizado**: siempre `db.prepare(…).run/get/all(params)`.
- [ ] **Migraciones**: no hay migración en esta task.
- [x] **Datos personales** (docs/RGPD.md): cancelar no borra (RGPD §4).
- [ ] **Accesibilidad** (web): roles y nombres accesibles, `role="status"`/`role="alert"`, estados de carga, vacío y error.
- [x] **Caracteres crudos**: nunca NUL ni U+2028/U+2029 en el código.
- [x] **Reuso obligatorio**:
      `checkCancel` de `freeze-rules.ts`; `withTransaction`.

## 3. Prohibiciones
- [x] **El builder no hace commit**: deja los cambios en el árbol; la sesión integra, verifica y comitea.
- [x] **No arregles bugs fuera de alcance: repórtalos.**
- [x] **Nunca** `git add -A`, `git add .`, `git stash`, `git push` ni cambios de rama.
- [x] **No toques ficheros que no estén en "Archivos afectados"** sin decirlo en el informe.
- [x] **No instales dependencias.** Nada de red; datos inventados.
- [x] **No ejecutes la suite completa**: tests acotados a tus ficheros.

## 4. Verificación que debes PEGAR en tu informe (salida real, no un resumen)
- [x] `npm test -w apps/api -- attendance/freeze-cancel.test`: 1 fichero(s) de test.
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
src/modules/attendance/freeze-routes.ts(47,26): error TS2339: Property 'cancel' does not exist on type
'{ list(memberId: number): FreezeList; create(memberId: number, range: FreezeRange): FreezeResult; }'.
$ npm test -w apps/api -- attendance/freeze-cancel.test
     × CA-07: cancela una que empieza la semana que viene y sus días vuelven al cupo
     AssertionError: expected 500 to be 200

# Ciclo 1 (verde)
$ npm test -w apps/api -- attendance/freeze-cancel.test
 Test Files  1 passed (1)
      Tests  7 passed (7)

$ npm run typecheck
(exit 0)

$ npx eslint apps/api
(exit 0, sin salida)
```

- **Resultado:** verde en el ciclo 1/2. La primera integración dio rojo: el informe del builder decía que `cancel` estaba en `freeze-service.ts`, pero el cambio no había llegado al fichero (el typecheck lo cazó y los 6 tests de cancelar daban 500). Vuelta al builder con la salida real; en la segunda, verde.
- **Commit:** el de esta task, `feat(api): cancel a freeze before it starts [HU-02 TASK-04]`.
- **APRENDIZAJE:** ejecutar, no suponer: el informe de un builder no es evidencia; la salida del typecheck sí.
