---
id: UC-03
titulo: "Cancelar una congelación"
modulo: asistencia
actor: socio
estado: aprobado          # borrador | aprobado | implementado | obsoleto
feature: FEAT-02
hus: [HU-02]
---

# UC-03: Cancelar una congelación

> Caso de uso del catálogo del módulo. Lo crea `/feature-shaping` (estado `borrador`), lo enlazan por su ID la HU,
> el PRD y la revisión, y `/module-sync` lo marca `implementado` cuando la HU que lo cubre llega a `main`.
> Cada flujo tiene un identificador estable (**P**, **A1…**, **E1…**): el PRD convierte cada uno en, al menos, un
> criterio de aceptación, y la revisión exige un test por flujo.

## Objetivo
El socio cancela una congelación que aún no ha empezado (por ejemplo, porque cambia de planes) y recupera sus días.

## Actor y disparador
- **Actor principal:** socio (DEC-04).
- **Disparador:** el socio pulsa "Cancelar" junto a una congelación de su lista.

## Precondiciones
- El socio tiene al menos una congelación activa.

## Flujo principal (P)
1. El socio pulsa "Cancelar" en una congelación que empieza después de hoy.
2. El sistema la marca como cancelada (no la borra) y sus días vuelven al cupo (RN-07).
3. El sistema muestra la lista sin ella y los días que le quedan.

## Flujos alternativos
Ninguno.

## Excepciones
- **E1: Ya ha empezado** (en el paso 2): el inicio es hoy o anterior → no se cancela y se le dice por qué (RN-07,
  R5).

## Reglas de negocio
- RN-07: solo se cancela una congelación que aún no ha empezado; sus días vuelven al cupo.

## Postcondiciones
- **Éxito:** la congelación queda cancelada y deja de contar en el cupo y en la racha.
- **Fallo:** la congelación sigue igual.

## Datos personales
Marca cuándo se canceló. Las canceladas se conservan mientras sea socio ([RGPD.md](../../../RGPD.md) §4).

## Trazabilidad
| Flujo | HU | Criterio de aceptación (PRD) | Test |
|---|---|---|---|
| P | HU-02 | CA-07 | |
| E1 | HU-02 | CA-08 | |

_La rellenan `/prd-writer` (CA), `/reviewer` (test) y `/module-sync` (al cerrar). Un flujo sin test es un hallazgo._
