---
id: FEAT-02
titulo: "Congelar la racha"
estado: entregada        # shaping | priorizada | en delivery | entregada
prioridad: alta
idea_origen: IDEA-002
modulos_afectados: [asistencia]
fecha: 2026-11-18
owner: "Nuria (PO de GymTonic)"
---

# FEAT-02: Congelar la racha

> Análisis funcional **sin asunciones**: cada elemento cita su fuente (una respuesta `R1…` de Nuria, una regla
> validada `RV-NN`, una decisión `DEC-NN`, la constitución o `docs/RGPD.md`). Lo que no tiene fuente es una pregunta
> abierta. **Firma 1 (producto):** Nuria, 2026-11-18.

## Qué
El socio puede congelar su racha unos días por vacaciones o lesión: mientras está congelada no la pierde _(IDEA-002)_.

## Por qué
Socios que pierden la racha por una ausencia que no pueden evitar dejan de usarla y de venir. **Métrica de éxito:**
que baje un 30 % el número de rachas de 14 días o más que se rompen, comparando los tres meses siguientes con los tres
anteriores _(R7; constitución, principio 2)_.

## Alcance
- **Dentro:** congelar un rango de días desde hoy en adelante, con un cupo anual; cancelar una congelación que aún no
  ha empezado; que la racha se salte los días congelados; ver en la pantalla que la racha está congelada _(R1-R6)_.
- **Fuera:** motivo o justificante (puede revelar datos de salud), aprobación del gimnasio, avisos o recordatorios,
  congelar días pasados, editar o acortar una congelación ya empezada y cupos por tipo de abono _(R2, R5, R6; RGPD §2)_.

## Actores y roles
- **Socio:** congela y cancela su propia racha. Sin login: actúa sobre el socio elegido en el selector _(DEC-04)_.

## Casos de uso

| UC | Título | Módulo | Flujos | Fichero | Nuevo / modificado |
|---|---|---|---|---|---|
| UC-01 | Ver mi racha de asistencia | asistencia | A3, A4, A5 (nuevos) | `docs/05_modules/asistencia/casos-de-uso/UC-01-ver-racha.md` | Modificado |
| UC-02 | Congelar mi racha | asistencia | P, A1, E1, E2, E3 | `docs/05_modules/asistencia/casos-de-uso/UC-02-congelar-racha.md` | Nuevo |
| UC-03 | Cancelar una congelación | asistencia | P, E1 | `docs/05_modules/asistencia/casos-de-uso/UC-03-cancelar-congelacion.md` | Nuevo |

## Reglas de negocio
- **RN-01 · Rango de días.** Una congelación es un rango de días de calendario `[inicio, fin]`, los dos incluidos, en
  Europe/Madrid _(R1; RV-01; DEC-07)_.
- **RN-02 · Nunca hacia atrás.** El inicio es hoy o un día futuro; el fin, igual o posterior al inicio _(R2)_.
- **RN-03 · Cupo anual.** Como mucho 7 días congelados por año natural, sumando todas las congelaciones no canceladas.
  Si un rango cruza de año, cada día cuenta en su año _(R1)_.
- **RN-04 · Sin solapes.** Una congelación no puede compartir ningún día con otra no cancelada del mismo socio _(R3)_.
- **RN-05 · Ni suma ni rompe.** Al contar la racha hacia atrás, un día congelado sin check-in se salta: no suma y no
  corta la racha _(R4)_.
- **RN-06 · Venir un día congelado cuenta.** Un check-in en un día congelado suma como cualquier otro día _(R4; RV-02)_.
- **RN-07 · Cancelar antes de empezar.** Se puede cancelar una congelación cuyo inicio es posterior a hoy; sus días
  vuelven al cupo. Una que ya ha empezado no se cancela ni se edita _(R5)_.
- **RN-08 · Se ve en la pantalla.** Si hoy está congelado, la pantalla lo dice con la fecha de fin, además de la racha
  _(R6)_.
- **RN-09 · Sin motivo.** No se pide ni se guarda el motivo, ni ningún texto libre: puede revelar datos de salud
  _(R6; RGPD §2; constitución, principio 3)_.

## Invariantes
- **INV-01:** los días congelados no cancelados de un socio nunca pasan de 7 en un año natural _(RN-03)_.
- **INV-02:** dos congelaciones no canceladas del mismo socio nunca comparten un día _(RN-04)_.
- **INV-03:** congelar nunca hace que la racha baje; sin congelaciones, la racha es la de la v1 _(RN-05, RN-06)_.

## Datos y conceptos clave
- **Congelación** (`Freeze`): socio, inicio, fin, cuándo se creó y, si se cancela, cuándo. Datos personales del socio
  (días que no vendrá), para no romper su racha, mientras sea socio; **nunca el motivo** _(RGPD §1, §2 y §4)_.

## Casos límite
- **Input inválido:** fecha que no es de calendario (`2026-02-31`), formato distinto (`15/10/2026`), fin antes del
  inicio, un campo de más (p. ej. `reason`) → error junto al campo y nada guardado _(RN-01, RN-02, RN-09)_.
- **Boundary:** inicio hoy (vale); inicio ayer (no vale); exactamente 7 días en el año (vale); 8 (no vale); rango del
  30 de diciembre al 2 de enero (2 días en cada año); el cambio de día a medianoche de Madrid _(RN-02, RN-03)_.
- **Fallo de dependencia:** si no se puede guardar, no queda nada a medias _(DEC-08)_.
- **Concurrencia:** dos congelaciones que se solapan enviadas a la vez → solo entra una _(RN-04)_.
- **Datos corruptos o legacy:** socios sin congelaciones → la racha se calcula como en la v1; una congelación cancelada
  no cuenta _(INV-03)_.
- **Seguridad:** cancelar la congelación de otro socio → no encontrada _(DEC-04)_.
- **Idempotencia:** cancelar dos veces la misma congelación → la segunda dice que ya estaba cancelada, sin cambiar nada
  _(R5)_.

## Módulos afectados
`asistencia`: congelaciones nuevas (datos, API y web) y la racha, que se salta los días congelados.

## Dependencias, riesgos y supuestos
- **Dependencias:** la racha v1 (HU-01, en `main`).
- **Riesgos:** que la congelación se use para tapar fallos (lo evita RN-02); que el motivo se cuele como texto libre
  (lo evita RN-09).
- **Supuestos confirmados:** ninguno sin respuesta: todo está en R1-R7.

## Criterios de aceptación
- [x] Dado un socio con racha de 10 días, cuando congela del lunes al domingo siguientes y no viene esos días, entonces
  el lunes de después sigue con 10 días y, si viene, pasa a 11.
- [x] Dado un socio que ya ha congelado 5 días este año, cuando intenta congelar 3 más, entonces no se guarda y se le
  dice cuántos le quedan (2).
- [x] Dado hoy, cuando el socio intenta congelar empezando ayer, entonces no se guarda.
- [x] Dado un socio con una congelación de 3 días, cuando intenta otra que comparte un día, entonces no se guarda.
- [x] Dado un socio con un día congelado, cuando viene ese día, entonces la racha suma 1.
- [x] Dado una congelación que empieza la semana que viene, cuando el socio la cancela, entonces sus días vuelven al
  cupo; y si ya ha empezado, no se puede cancelar.
- [x] Dado que hoy está congelado, cuando el socio abre la app, entonces ve su racha y "Racha congelada hasta el
  dd/mm/aaaa".

## Preguntas abiertas
Ninguna. Las respuestas de Nuria (2026-11-18), literales:

| # | Pregunta | Respuesta de Nuria |
|---|---|---|
| R1 | ¿Cuántos días se puede congelar y cómo se cuentan? | Hasta 7 días por año natural, en total, en uno o varios rangos de días seguidos. Si un rango cruza de año, cada día cuenta en su año. |
| R2 | ¿Se puede congelar hacia atrás? | No. Desde hoy en adelante. Si se le olvidó, mala suerte: así no lo usa para tapar fallos. |
| R3 | ¿Dos congelaciones pueden solaparse? | No. |
| R4 | ¿Qué hace la racha mientras está congelada? ¿Y si viene? | Ni suma ni se rompe: esos días se saltan. Si viene un día congelado, cuenta normal. |
| R5 | ¿Se puede cancelar o cambiar? | Cancelar, solo si aún no ha empezado, y los días vuelven al cupo. Cambiarla no: que la cancele y cree otra. Ya empezada, no se toca. |
| R6 | ¿Motivo, aprobación del gimnasio, avisos? ¿Qué ve el socio? | Nada de motivo ni aprobación ni avisos en esta versión: el motivo puede ser una lesión o una baja, y no queremos datos de salud. En la pantalla, que vea que está congelada y hasta cuándo. Los cupos por tipo de abono, más adelante. |
| R7 | ¿Cómo sabremos si ha servido? | Si baja un 30 % el número de rachas de 14 días o más que se rompen, comparando tres meses antes y después. |

## Handoff a delivery
1. **HU-02 · Congelar mi racha** (cálculo de la racha, datos, API y web). Cubre UC-01 (A3, A4, A5), UC-02 y UC-03, y
   RN-01 a RN-09. Una sola HU: pequeña y vertical. Depende de HU-01 (en `main`).
