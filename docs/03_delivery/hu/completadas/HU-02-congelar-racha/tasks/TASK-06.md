# TASK-06: Casos adversariales de la congelación [adversarial]

## Metadata
- **HU:** HU-02 · **Feature:** FEAT-02
- **Scope:** test
- **Capa:** api: builder `api-builder`
- **Estado:** Completada
- **Complejidad:** S (< 1 h)

## Descripción
Intentar romper la congelación: dos solapadas a la vez, un fallo al guardar, un campo de motivo, cuerpos hostiles (no JSON, vacío, array), la medianoche de Madrid al decidir "hoy" y la rapidez con muchas congelaciones.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/api/test/attendance/freeze-adversarial.test.ts` | crear |

## Implementa
- EC-05, EC-06, EC-14, EC-15 · RNF-01, RNF-02, RNF-04
- Diseño: `plans/TECHNICAL_DOC-backend.md` § "Error paths", "Threat modeling"

## Dependencias
- **Depende de:** TASK-02, TASK-03
- **Bloquea:** nada

## Criterios de done
- [x] EC-05: dos `POST` solapados a la vez → uno 201 y otro 409.
- [x] EC-06: con la escritura rota, 500 y 0 filas.
- [x] EC-14: `reason` → 400 y nada guardado.
- [x] EC-15: cuerpo que no es JSON, vacío o un array → 400.
- [x] RNF-02: a las 23:30 UTC de invierno "hoy" ya es mañana en Madrid.
- [x] RNF-01: menos de 300 ms con 400 check-ins y 20 congelaciones.
- [x] `npm test -w apps/api -- attendance/freeze-adversarial.test` en verde, con 1 fichero(s) de test.
- [x] `npm run typecheck` sin errores.
- [x] `npx eslint <ficheros tocados>` sin errores.
- [x] Commit único `test(api): adversarial freeze cases [HU-02 TASK-06]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
