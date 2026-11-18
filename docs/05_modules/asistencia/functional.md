# Módulo `asistencia` (código `attendance`): Funcional

Estado de `main` sincronizado hasta **HU-02** (2026-11-18). Lo mantiene `/module-sync`; la foto técnica está en
[technical.md](technical.md).

## Propósito

El socio de GymTonic registra su asistencia al gimnasio y ve su constancia: cuántos días seguidos ha venido
(FEAT-01, IDEA-001), y puede congelar su racha unos días para no perderla por una ausencia que no puede evitar
(FEAT-02, IDEA-002). Es el único módulo de GymApp.

## Alcance objetivo

El de FEAT-01 (la racha de asistencia, con sus estados) y FEAT-02 (congelar la racha desde hoy, con un cupo de 7 días
por año natural, cancelar antes de empezar y el aviso de congelada). Fuera: notificaciones push, ranking, check-in
retroactivo, historial o récord, check-in sin conexión y, en la congelación, motivo o justificante (datos de salud,
RGPD §2), aprobación del gimnasio, avisos, congelar días pasados, editar una congelación y cupos por tipo de abono.

## Actores

Un único actor, el **socio**, sin login (DEC-04): elige su nombre en un selector.

## Capacidades

| Capacidad | UC | Estado | HU | Qué hay hoy |
|---|---|---|---|---|
| Elegir socio y hacer check-in | - | ✅ | T-01, T-02 (sprint-01) | Selector con los socios; el check-in de hoy en días de Madrid; un segundo check-in el mismo día lo dice y no suma |
| Ver mi racha de asistencia | UC-01 | ✅ | HU-01, HU-02 | Racha en grande, "Empieza tu racha hoy" con 0, felicitación desde 7, se actualiza tras el check-in y, sin conexión, la última racha guardada con aviso. Desde HU-02, salta los días congelados y avisa "Racha congelada hasta el dd/mm/aaaa" |
| Congelar mi racha | UC-02 | ✅ | HU-02 | Rango "Desde/Hasta" desde hoy, hasta 7 días por año natural (cada día en su año), sin solapes; errores junto a su campo; los días que quedan; sin motivo |
| Cancelar una congelación | UC-03 | ✅ | HU-02 | "Cancelar" en las que aún no han empezado; los días vuelven al cupo; las empezadas no se tocan |

## Alcance no implementado

- Nada de FEAT-01 ni de FEAT-02. Pendiente de decidir: mostrar de qué día es la racha guardada sin conexión (O-1 de la
  review de HU-01) y mostrar el cupo del año siguiente a quien congela en diciembre días de enero (O-1 de la review de
  HU-02). Las dos, apuntadas por Nuria para la siguiente versión.

## Reglas de negocio

Las de FEAT-01, todas implementadas en `main`:
- **RN-01**: un día es el día de calendario de Europe/Madrid (DEC-07).
- **RN-02**: varios check-ins el mismo día cuentan uno (el check-in no duplica; los duplicados antiguos cuentan uno).
- **RN-03**: si hoy aún no ha venido pero ayer sí, la racha cuenta desde ayer.
- **RN-04**: un día completo sin check-in reinicia la racha a 0.
- **RN-05**: felicitación a partir de 7 días; la decide la API.
- **RN-06**: sin conexión, la última racha guardada con aviso; sin conexión no hay check-in.

Las de FEAT-02, todas implementadas en `main`:
- **RN-01/RN-02**: una congelación es un rango `[inicio, fin]` de días de Madrid, desde hoy y con el fin no anterior.
- **RN-03**: como mucho 7 días por año natural; si cruza de año, cada día cuenta en el suyo.
- **RN-04**: sin solapes con otra congelación activa del socio.
- **RN-05/RN-06**: un día congelado sin check-in ni suma ni rompe; venir un día congelado suma.
- **RN-07**: se cancela solo antes de empezar; cancelar marca, no borra, y los días vuelven al cupo.
- **RN-08**: hoy congelado: "Racha congelada hasta el dd/mm/aaaa".
- **RN-09**: sin motivo ni texto libre (RGPD §2).

## Historial

| Fecha | HU | Qué | % MVP |
|---|---|---|---|
| 2026-11-16 | - | Esqueleto del módulo (solo documentación) | 0 % |
| 2026-11-17 | T-01, T-02 | Socios y check-in | 40 % |
| 2026-11-17 | HU-01 | Racha de asistencia | 100 % de FEAT-01 |
| 2026-11-18 | HU-02 | Congelar la racha | 100 % de FEAT-02 |
