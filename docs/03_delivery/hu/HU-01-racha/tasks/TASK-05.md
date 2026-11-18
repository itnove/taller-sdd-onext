# TASK-05: Casos adversariales de la racha [adversarial]

## Metadata
- **HU:** HU-01 · **Feature:** FEAT-01
- **Scope:** test
- **Capa:** api: builder `api-builder`
- **Estado:** Pendiente
- **Complejidad:** S (< 1 h)

## Descripción
Intentar romper la racha: fronteras de Madrid en invierno y verano, `:id` hostil, fallo de lectura de la base y duplicados antiguos.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/api/test/attendance/streak-adversarial.test.ts` | crear |

## Implementa
- CA-01 · EC-02, EC-03, EC-10, EC-11 · RNF-02
- Diseño: `plans/TECHNICAL_DOC-backend.md` § "Error paths", "Threat modeling"

## Dependencias
- **Depende de:** TASK-02
- **Bloquea:** nada

## Criterios de done
- [ ] EC-02: 23:59:59 y 00:00:00 de Madrid, en invierno y en verano, son días distintos.
- [ ] EC-10: `1' OR '1'='1`, `0` y `-1` dan 400 sin llegar al SQL.
- [ ] EC-11: con la lectura rota, 500 `INTERNAL_ERROR` sin el nombre del socio.
- [ ] EC-03: duplicados antiguos insertados a mano cuentan uno.
- [ ] `npm test -w apps/api -- attendance/streak-adversarial.test` en verde, con 1 fichero(s) de test.
- [ ] `npm run typecheck` sin errores.
- [ ] `npx eslint <ficheros tocados>` sin errores.
- [ ] Commit único `test(api): adversarial streak cases [HU-01 TASK-05]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
