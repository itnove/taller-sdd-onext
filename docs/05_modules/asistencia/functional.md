# Módulo `asistencia` (código `attendance`): Funcional

Estado de `main` sincronizado hasta **HU-01** (2026-11-17). Lo mantiene `/module-sync`; la foto técnica está en
[technical.md](technical.md).

## Propósito

El socio de GymTonic registra su asistencia al gimnasio y ve su constancia: cuántos días seguidos ha venido
(FEAT-01, IDEA-001). Es el único módulo de GymApp.

## Alcance objetivo

El de FEAT-01: la racha de asistencia calculada a partir de los check-ins, en API y web, con sus estados (vacío, con
racha, tres dígitos, felicitación y sin conexión). Fuera: notificaciones push, congelar la racha, ranking, check-in
retroactivo, historial o récord y check-in sin conexión.

## Actores

Un único actor, el **socio**, sin login (DEC-04): elige su nombre en un selector.

## Capacidades

| Capacidad | UC | Estado | HU | Qué hay hoy |
|---|---|---|---|---|
| Elegir socio y hacer check-in | - | ✅ | T-01, T-02 (sprint-01) | Selector con los socios; el check-in de hoy en días de Madrid; un segundo check-in el mismo día lo dice y no suma |
| Ver mi racha de asistencia | UC-01 | ✅ | HU-01 | Racha en grande, "Empieza tu racha hoy" con 0, felicitación desde 7, se actualiza tras el check-in y, sin conexión, la última racha guardada con aviso |

## Alcance no implementado

- Nada de FEAT-01. Pendiente de decidir: mostrar de qué día es la racha guardada sin conexión (observación O-1 de la
  review de HU-01; Nuria lo verá con el check-in sin conexión).

## Reglas de negocio

Las de FEAT-01, todas implementadas en `main`:
- **RN-01**: un día es el día de calendario de Europe/Madrid (DEC-07).
- **RN-02**: varios check-ins el mismo día cuentan uno (el check-in no duplica; los duplicados antiguos cuentan uno).
- **RN-03**: si hoy aún no ha venido pero ayer sí, la racha cuenta desde ayer.
- **RN-04**: un día completo sin check-in reinicia la racha a 0.
- **RN-05**: felicitación a partir de 7 días; la decide la API.
- **RN-06**: sin conexión, la última racha guardada con aviso; sin conexión no hay check-in.

## Historial

| Fecha | HU | Qué | % MVP |
|---|---|---|---|
| 2026-11-16 | - | Esqueleto del módulo (solo documentación) | 0 % |
| 2026-11-17 | T-01, T-02 | Socios y check-in | 40 % |
| 2026-11-17 | HU-01 | Racha de asistencia | 100 % de FEAT-01 |
