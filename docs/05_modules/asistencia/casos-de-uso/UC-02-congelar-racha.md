---
id: UC-02
titulo: "Congelar mi racha"
modulo: asistencia
actor: socio
estado: implementado      # borrador | aprobado | implementado | obsoleto
feature: FEAT-02
hus: [HU-02]
---

# UC-02: Congelar mi racha

> Caso de uso del catálogo del módulo. Lo crea `/feature-shaping` (estado `borrador`), lo enlazan por su ID la HU,
> el PRD y la revisión, y `/module-sync` lo marca `implementado` cuando la HU que lo cubre llega a `main`.
> Cada flujo tiene un identificador estable (**P**, **A1…**, **E1…**): el PRD convierte cada uno en, al menos, un
> criterio de aceptación, y la revisión exige un test por flujo.

## Objetivo
El socio congela unos días de su racha (vacaciones, lesión…) para no perderla por una ausencia que no puede evitar.

## Actor y disparador
- **Actor principal:** socio (DEC-04).
- **Disparador:** el socio rellena "Desde" y "Hasta" en "Congelar mi racha" y pulsa "Congelar".

## Precondiciones
- El socio existe y está elegido en el selector.

## Flujo principal (P)
1. El socio indica el primer y el último día que no podrá venir.
2. El sistema comprueba que son días válidos, que el inicio es hoy o después y el fin no es anterior (RN-01, RN-02).
3. El sistema comprueba el cupo de 7 días por año natural y que no se solapa con otra congelación activa (RN-03,
   RN-04).
4. El sistema guarda la congelación y muestra los días que le quedan este año.

## Flujos alternativos
- **A1: Cruza de año** (desde el paso 3): el rango va del 30 de diciembre al 2 de enero → cada día cuenta en el cupo
  de su año (R1).

## Excepciones
- **E1: Fechas no válidas** (en el paso 2): un día que no existe, otro formato, el inicio antes de hoy o el fin antes
  del inicio → error junto al campo; no se guarda nada (RN-01, RN-02).
- **E2: Sin cupo** (en el paso 3): se pasaría de 7 días en algún año → no se guarda y se le dice cuántos le quedan
  (RN-03).
- **E3: Solape** (en el paso 3): comparte algún día con otra congelación activa → no se guarda (RN-04).

## Reglas de negocio
- RN-01 a RN-04 y RN-09 de FEAT-02.

## Postcondiciones
- **Éxito:** la congelación queda guardada y activa; el cupo del año baja.
- **Fallo:** nada guardado; el formulario conserva lo escrito.

## Datos personales
Escribe los días que el socio no vendrá (ejecución del contrato, [RGPD.md](../../../RGPD.md) §3). **Nunca el motivo**
(RGPD §2).

## Trazabilidad
| Flujo | HU | Criterio de aceptación (PRD) | Test |
|---|---|---|---|
| P | HU-02 | CA-04 | `apps/api/test/attendance/freeze-api.test.ts:27`, `e2e/freeze.spec.ts:23` |
| A1 | HU-02 | CA-02 | `apps/api/test/attendance/freeze-rules.test.ts:68` |
| E1 | HU-02 | CA-01 | `apps/api/test/attendance/freeze-api.test.ts:61`, `e2e/freeze.spec.ts:56` |
| E2 | HU-02 | CA-02 | `apps/api/test/attendance/freeze-api.test.ts:94`, `apps/web/test/features/attendance/FreezeSection.test.tsx:103` |
| E3 | HU-02 | CA-03 | `apps/api/test/attendance/freeze-api.test.ts:110` |

_La rellenan `/prd-writer` (CA), `/reviewer` (test) y `/module-sync` (al cerrar). Un flujo sin test es un hallazgo._
