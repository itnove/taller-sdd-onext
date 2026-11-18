---
id: UC-01
titulo: "Ver mi racha de asistencia"
modulo: asistencia
actor: socio
estado: aprobado          # borrador | aprobado | implementado | obsoleto
feature: FEAT-02
hus: [HU-01, HU-02]
---

# UC-01: Ver mi racha de asistencia

> Caso de uso del catálogo del módulo. Lo crea `/feature-shaping` (estado `borrador`), lo enlazan por su ID la HU,
> el PRD y la revisión, y `/module-sync` lo marca `implementado` cuando la HU que lo cubre llega a `main`.
> Cada flujo tiene un identificador estable (**P**, **A1…**, **E1…**): el PRD convierte cada uno en, al menos, un
> criterio de aceptación, y la revisión exige un test por flujo.

## Objetivo
El socio ve cuántos días seguidos ha venido al gimnasio, para motivarse a no romper la racha.

## Actor y disparador
- **Actor principal:** socio (DEC-04).
- **Disparador:** el socio abre GymApp y elige su nombre, o hace check-in.

## Precondiciones
- El socio existe. Sus check-ins se registran con el check-in del módulo (T-01, sprint-01).

## Flujo principal (P)
1. El socio elige su nombre en el selector.
2. El sistema calcula los días seguidos con check-in hasta hoy, en días de Madrid; si hoy aún no ha venido pero ayer
   sí, cuenta desde ayer (RN-01 a RN-03).
3. El sistema muestra el número de días, grande, con "día seguido" o "días seguidos".

## Flujos alternativos
- **A1: Sin racha** (desde el paso 2): no vino ayer ni hoy, o no tiene check-ins → la racha es 0 y la pantalla dice
  "Empieza tu racha hoy" (RN-04; R3).
- **A2: Una semana o más** (desde el paso 3): la racha es de 7 días o más → además del número, un mensaje de
  felicitación (RN-05; R4).
- **A3: Días congelados** (desde el paso 2; FEAT-02): un día congelado sin check-in se salta al contar: ni suma ni
  rompe la racha (FEAT-02 · RN-05).
- **A4: Viene un día congelado** (desde el paso 2; FEAT-02): un check-in en un día congelado suma como cualquier otro
  (FEAT-02 · RN-06).
- **A5: Hoy congelado** (desde el paso 3; FEAT-02): además de la racha, "Racha congelada hasta el dd/mm/aaaa" con el
  fin de la congelación (FEAT-02 · RN-08).

## Excepciones
- **E1: Sin conexión** (en el paso 2): la API no responde → la web muestra la última racha guardada con el aviso
  "Sin conexión"; si no hay ninguna guardada, solo el aviso. No se inventa ninguna racha (RN-06; R5).

## Reglas de negocio
- RN-01: un día es el día de calendario de Europe/Madrid.
- RN-02: varios check-ins el mismo día cuentan como uno.
- RN-03: si hoy aún no ha venido pero ayer sí, la racha cuenta desde ayer.
- RN-04: un día completo sin check-in reinicia la racha a 0.
- RN-05: felicitación a partir de 7 días.
- RN-06: sin conexión, la última racha guardada con aviso.
- FEAT-02 · RN-05, RN-06 y RN-08: los días congelados se saltan, venir un día congelado suma y hoy congelado se avisa.

## Postcondiciones
- **Éxito:** el socio ve su racha; consultar no cambia ningún dato.
- **Fallo:** sin conexión, ve la última guardada o solo el aviso; nada cambia en el servidor.

## Datos personales
Lee los días con check-in del socio (ejecución del contrato, [RGPD.md](../../../RGPD.md) §3). En el navegador guarda
solo la última racha mostrada (§6).

## Trazabilidad
| Flujo | HU | Criterio de aceptación (PRD) | Test |
|---|---|---|---|
| P | HU-01 | CA-01, CA-02 | `apps/api/test/attendance/streak.test.ts:18`, `apps/web/test/features/attendance/StreakPanel.test.tsx:63` |
| A1 | HU-01 | CA-03 | `apps/api/test/attendance/streak.test.ts:22`, `e2e/streak.spec.ts:29` |
| A2 | HU-01 | CA-04 | `apps/api/test/attendance/streak-api.test.ts:43`, `e2e/streak.spec.ts:6` |
| E1 | HU-01 | CA-05 | `apps/web/test/features/attendance/StreakPanel.test.tsx:82` |
| A3 | HU-02 | CA-05 | |
| A4 | HU-02 | CA-06 | |
| A5 | HU-02 | CA-09 | |

_La rellenan `/prd-writer` (CA), `/reviewer` (test) y `/module-sync` (al cerrar). Un flujo sin test es un hallazgo._
