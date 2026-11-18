---
id: FEAT-01
titulo: "Racha de asistencia"
estado: entregada        # shaping | priorizada | en delivery | entregada
prioridad: alta
idea_origen: IDEA-001
modulos_afectados: [asistencia]
fecha: 2026-11-16
owner: "Nuria (PO de GymTonic)"
---

# FEAT-01: Racha de asistencia

> Análisis funcional **sin asunciones**: cada elemento cita su fuente (una respuesta `R1…` de Nuria, una regla
> validada `RV-NN`, una decisión `DEC-NN` o la constitución). Lo que no tiene fuente es una pregunta abierta.
> **Firma 1 (producto):** Nuria, 2026-11-16.

## Qué
El socio ve cuántos días seguidos ha venido al gimnasio _(IDEA-001)_.

## Por qué
Reforzar la constancia en las primeras semanas, cuando más socios abandonan. **Métrica de éxito:** +3 % de retención
mensual en los socios que ven su racha _(R6; constitución, principio 2)_.

## Alcance
- **Dentro:** cálculo de la racha a partir de los check-ins; consulta por la API; pantalla con sus estados (vacío, con
  racha, tres dígitos, felicitación, sin conexión) _(R1-R5)_.
- **Fuera:** notificaciones push, congelar la racha (vacaciones o lesión), ranking entre socios, check-in retroactivo,
  historial o récord de rachas y check-in sin conexión _(R5, R6)_.

## Actores y roles
- **Socio:** consulta su racha. Sin login: elige su nombre en un selector _(DEC-04)_.

## Casos de uso

| UC | Título | Módulo | Flujos | Fichero | Nuevo / modificado |
|---|---|---|---|---|---|
| UC-01 | Ver mi racha de asistencia | asistencia | P, A1, A2, E1 | `docs/05_modules/asistencia/casos-de-uso/UC-01-ver-racha.md` | Nuevo |

El check-in en sí (elegir el socio y registrar la asistencia de hoy) es la base del módulo y entra como tarea de
sprint sin HU (`T-01` y `T-02` del sprint-01): no hay nada que preguntar ni que aceptar.

## Reglas de negocio
- **RN-01 · Día de calendario.** Un día es el día de calendario en la zona horaria del gimnasio de alta; en esta
  versión, Europe/Madrid para todos _(R1, RV-01, DEC-07)_.
- **RN-02 · Un check-in por día.** Varios check-ins el mismo día cuentan como uno _(R2, RV-02)_.
- **RN-03 · Racha viva hasta acabar el día.** Si hoy aún no ha venido pero ayer sí, la racha sigue viva: se cuenta
  desde ayer _(R3, RV-03)_.
- **RN-04 · Reinicio.** Un día completo sin check-in reinicia la racha a 0 _(R3, RV-03)_.
- **RN-05 · Felicitación.** Con 7 días o más, la pantalla muestra un mensaje de felicitación; sin premios _(R4, RV-04)_.
- **RN-06 · Sin conexión.** Si la API no responde, la web muestra la última racha guardada con el aviso "sin conexión";
  sin conexión no se puede hacer check-in _(R5, RV-05)_.

## Invariantes
- **INV-01:** la racha es siempre un entero mayor o igual que 0 _(RN-03, RN-04)_.
- **INV-02:** un día nunca suma más de 1 a la racha _(RN-02)_.

## Datos y conceptos clave
- **Socio** (`Member`): nombre. **Check-in** (`CheckIn`): socio y día de Madrid. **Racha**: días seguidos con check-in.
- Datos personales: los días con check-in del socio, para calcular su racha, mientras sea socio. En el navegador solo
  la última racha mostrada ([RGPD.md](../../../../RGPD.md) §1 y §6).

## Casos límite
- **Input inválido:** socio que no existe → 404 `MEMBER_NOT_FOUND`, sin racha _(DEC-06)_.
- **Boundary:** el corte del día es la medianoche de Madrid, no la de UTC, en invierno y en verano _(RN-01)_; una racha
  de tres dígitos cabe en la pantalla _(R1, principios de diseño 1)_; con 6 días no hay felicitación y con 7 sí _(RN-05)_.
- **Fallo de dependencia:** la API no responde → última racha guardada con aviso; sin nada guardado, solo el aviso
  _(RN-06)_.
- **Concurrencia:** dos check-ins casi a la vez el mismo día → cuentan uno _(RN-02)_.
- **Datos corruptos o legacy:** check-ins duplicados de antes de esta feature → cuentan uno _(RN-02)_.
- **Seguridad:** la respuesta de la racha no incluye la lista de check-ins ni el nombre _(RGPD §6)_.
- **Idempotencia:** consultar la racha no cambia nada.

## Módulos afectados
`asistencia`: nueva consulta de la racha (API y web) sobre los check-ins de T-01.

## Dependencias, riesgos y supuestos
- **Dependencias:** la base de socios y check-ins (`T-01`, `T-02`), en el mismo sprint.
- **Riesgos:** el corte del día en UTC rompería rachas a medianoche (lo evita DEC-07).
- **Supuestos confirmados:** ninguno sin respuesta: todo está en R1-R6.

## Criterios de aceptación
- [x] Dado un socio con 4 días seguidos, cuando hace check-in hoy, entonces la racha muestra 5 días.
- [x] Dado un socio que vino ayer pero hoy no, cuando abre la app, entonces su racha sigue contando desde ayer.
- [x] Dado un socio que faltó anteayer y ayer, cuando abre la app, entonces su racha es 0.
- [x] Dado un socio sin check-ins, cuando abre la app, entonces ve "Empieza tu racha hoy".
- [x] Dado un socio con 6 días seguidos, cuando hace check-in hoy, entonces ve 7 días y la felicitación.
- [x] Dado que la API no responde, cuando el socio abre la app, entonces ve su última racha guardada y el aviso.

## Preguntas abiertas
Ninguna. Las respuestas de Nuria (2026-11-16), literales:

| # | Pregunta | Respuesta de Nuria |
|---|---|---|
| R1 | ¿Qué es un día, y en qué zona horaria? | El día de calendario del gimnasio de alta. Hoy todos los gimnasios están en Madrid. |
| R2 | ¿Dos check-ins el mismo día? | Cuentan como uno. |
| R3 | Si hoy aún no ha venido, ¿se rompe la racha? | No: hasta que acaba el día puede venir. Se rompe con un día completo sin venir. |
| R4 | ¿Algún premio o mensaje? | Un mensaje de felicitación a partir de 7 días. Sin premios. |
| R5 | ¿Y sin conexión? | Que vea su última racha guardada con un aviso. El check-in sin conexión, más adelante. |
| R6 | ¿Qué queda fuera y cómo medimos? | Fuera: push, congelar, ranking, check-in retroactivo e historial. Medimos +3 % de retención mensual. Y que cargue rápido: menos de 300 ms. |

## Handoff a delivery
1. **HU-01 · Ver mi racha de asistencia** (dominio, API y web). Cubre UC-01 (P, A1, A2, E1) y RN-01 a RN-06. Una sola
   HU: es pequeña y vertical. Depende de la base de socios y check-ins (`T-01`, `T-02`).
