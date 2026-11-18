# HU-01: Ver mi racha de asistencia · PRD

## Info
- **HU:** HU-01 · **Feature:** FEAT-01
- **Scope:** fullstack
- **Módulos:** asistencia
- **Fecha:** 2026-11-16
- **Estado:** Ready · **Firma 2 (producto):** Nuria (PO), 2026-11-16

## Contexto

### Problema
Muchos socios abandonan en las primeras semanas sin que nadie lo note. Ver cuántos días seguidos llevan viniendo les
anima a no romper la racha (FEAT-01, métrica: +3 % de retención mensual).

### Situación actual
El socio elige su nombre y hace check-in (T-01 y T-02: `apps/api/src/modules/attendance/service.ts`,
`apps/web/src/features/attendance/AttendanceScreen.tsx`), pero no ve ninguna racha ni estadística.

### Resultado esperado
El socio abre GymApp, elige su nombre y ve cuántos días seguidos ha venido, con un mensaje al llegar a una semana y su
última racha aunque no haya conexión.

## Casos de uso

| UC · flujo | Descripción corta | CA |
|---|---|---|
| UC-01 · P | Ve su racha: días seguidos con check-in, contando desde ayer si hoy aún no ha venido | CA-01, CA-02 |
| UC-01 · A1 | Sin racha: 0 y "Empieza tu racha hoy" | CA-03 |
| UC-01 · A2 | 7 días o más: felicitación | CA-04 |
| UC-01 · E1 | Sin conexión: última racha guardada con aviso | CA-05 |

Fichero: `docs/05_modules/asistencia/casos-de-uso/UC-01-ver-racha.md`.

## Requisitos funcionales

| ID | Descripción | Prioridad | Scope | Criterios de aceptación |
|----|-------------|-----------|-------|-------------------------|
| RF-01 | **Cálculo de la racha** a partir de los check-ins del socio y del día de hoy (RN-01 a RN-04) | Must | backend | - [ ] CA-01<br>- [ ] CA-02<br>- [ ] CA-03 |
| RF-02 | **Consulta de la racha** por la API, con la indicación de felicitación (RN-05) | Must | backend | - [ ] CA-04<br>- [ ] CA-06 |
| RF-03 | **Pantalla de la racha** con sus estados: vacío, con racha, tres dígitos y felicitación | Must | frontend | - [ ] CA-03<br>- [ ] CA-04 |
| RF-04 | **Sin conexión:** la web guarda la última racha y la muestra con aviso si la API no responde (RN-06) | Should | frontend | - [ ] CA-05 |

## Requisitos no funcionales

| ID | Descripción | Categoría | Métrica concreta |
|----|-------------|-----------|------------------|
| RNF-01 | Rapidez de la consulta | Rendimiento | `GET` de la racha en menos de 300 ms en local con un socio de 400 check-ins (R6) |
| RNF-02 | Frontera del día | Fiabilidad | 100 % de los casos en verde con el reloj inyectado: 23:59:59 y 00:00:00 de Madrid, en invierno y en verano |
| RNF-03 | Accesibilidad | Accesibilidad | La racha y los avisos se anuncian con `role="status"`; 0 controles sin nombre accesible |
| RNF-04 | Minimización | Privacidad | La respuesta de la racha no incluye el nombre ni la lista de check-ins; el navegador guarda solo la última racha y su día |

## Modelo de datos
No aplica: la racha se calcula al consultarla con los `check_ins` de T-01 (`001-create-members-and-check-ins.sql`).
No se guarda en ninguna tabla.

## Interfaces / endpoints / pantallas

| Tipo | Ruta o pantalla | Cambio | Descripción |
|------|-----------------|--------|-------------|
| GET | /api/members/:id/streak | Nuevo | Días de racha, el día de hoy en Madrid y si toca felicitar |
| Pantalla | Tu asistencia | Modificar | Panel de la racha con sus estados y aviso sin conexión; se refresca tras el check-in |

## Flujos de usuario
1. El socio abre GymApp; se elige el primer socio del selector y se carga su racha.
2. Cambia de socio: se carga la racha del elegido.
3. Hace check-in: el aviso del check-in y la racha, actualizada.
4. Sin conexión: la última racha guardada de ese socio con el aviso, o solo el aviso.

## Datos personales
Lee los días con check-in del socio para contar su racha (ejecución del contrato, RGPD §3), mientras sea socio. La
respuesta devuelve solo `memberId`, `today`, `days` y `congratulate`: ni el nombre ni la lista de días. En el navegador
se guarda solo la última racha mostrada y su día (`gymapp:streak:<id>`, RGPD §6). Nada en logs ni errores.

## Edge cases

| ID | RF | Categoría | Situación | Comportamiento esperado |
|----|----|-----------|-----------|-------------------------|
| EC-01 | RF-01 | Boundary | Hoy sin check-in, ayer sí | La racha cuenta desde ayer (RN-03) |
| EC-02 | RF-01 | Boundary | Check-in a las 23:59:59 y a las 00:00:00 de Madrid, en invierno y en verano | Días distintos; cuenta el día de Madrid, no el de UTC |
| EC-03 | RF-01 | Datos corruptos | Dos check-ins del mismo día guardados antes de esta HU | Cuentan uno (RN-02) |
| EC-04 | RF-02 | Input inválido | Socio que no existe | 404 `MEMBER_NOT_FOUND` |
| EC-05 | RF-02 | Idempotencia | Consultar varias veces | Misma respuesta, sin cambios en los datos |
| EC-06 | RF-03 | Boundary | Racha de 120 días | El número de tres dígitos cabe y se lee |
| EC-07 | RF-03 | Boundary | Racha de 6 y de 7 días | Con 6 no hay felicitación; con 7 sí |
| EC-08 | RF-04 | Fallo de dependencia | La API no responde y no hay nada guardado | Aviso de sin conexión, sin inventar una racha |
| EC-09 | RF-02 | Concurrencia | Dos check-ins casi a la vez | Cuentan uno (ya lo garantiza el check-in de T-01) |
| EC-10 | RF-02 | Seguridad | `:id` con texto o comillas (`1' OR '1'='1`) | 400 `VALIDATION_ERROR`; SQL siempre parametrizado |
| EC-11 | RF-01 | Fallo de dependencia | La base de datos falla al leer | 500 `INTERNAL_ERROR` sin datos del socio en el mensaje |
| EC-12 | RF-03 | Input inválido | La API responde con una forma inesperada | Error genérico, sin pintar una racha falsa |

Categorías por RF Must: RF-01 (boundary, datos corruptos, fallo de dependencia; input inválido y seguridad en RF-02;
concurrencia N/A: solo lee; idempotencia N/A: solo lee), RF-02 (input inválido, idempotencia, concurrencia,
seguridad; boundary en RF-01), RF-03 (boundary ×2, input inválido; fallo de dependencia en RF-04; concurrencia N/A: 
la pantalla no escribe; datos corruptos N/A: la forma la valida el cliente, EC-12; idempotencia N/A: solo lee).

## Decisiones aplicables
- **DEC-04:** sin login; el socio se elige en el selector.
- **DEC-06:** 404 `MEMBER_NOT_FOUND` con el envelope; JSON Schema del `:id` y de la respuesta.
- **DEC-07:** "hoy" sale del reloj inyectado y el día es el de Madrid; la web no calcula "hoy".
- **DEC-08:** cálculo de la racha como función pura que recibe "hoy".

## Fuera de scope
- Push, congelar la racha, ranking, check-in retroactivo, historial o récord y el check-in sin conexión (FEAT-01).

## Open Questions
No hay preguntas abiertas.

## Decisiones tomadas

| ID | Decisión | Razón | Impacto en el PRD | Fecha |
|----|----------|-------|-------------------|-------|
| DT-01 | La felicitación la decide la API (`congratulate`), no la web | Una sola regla (7 días) en un sitio | RF-02 | 2026-11-16 |
| DT-02 | El aviso sin conexión dice "Sin conexión: esta es tu última racha guardada." | Nuria pidió un aviso claro (R5) | RF-04 | 2026-11-16 |

## Criterios de aceptación

| ID | Origen (UC · flujo o RF) | Dado | Cuando | Entonces |
|----|--------------------------|------|--------|----------|
| CA-01 | UC-01 · P / RF-01 (INV-01) | Cualquier conjunto de check-ins | Se calcula la racha | Es un entero mayor o igual que 0 |
| CA-02 | UC-01 · P / RF-01 | Un socio con 4 días seguidos hasta ayer | Hace check-in hoy | La racha muestra 5 días |
| CA-03 | UC-01 · A1 / RF-01, RF-03 | Un socio que faltó ayer (o sin check-ins) | Abre la app | La racha es 0 y ve "Empieza tu racha hoy" |
| CA-04 | UC-01 · A2 / RF-02, RF-03 | Un socio con 6 días seguidos | Hace check-in hoy | Ve 7 días y la felicitación |
| CA-05 | UC-01 · E1 / RF-04 | La API no responde | Abre la app | Ve su última racha guardada con el aviso "sin conexión" |
| CA-06 | RNF-01 / RF-02 | Un socio con 400 check-ins | Consulta la racha | La API responde en menos de 300 ms |

En notación EARS (como en el curso):

- **CA-01:** El contador de racha DEBE ser un entero mayor o igual que 0.
- **CA-02:** CUANDO el socio hace check-in en un día nuevo, el sistema DEBE incrementar la racha en 1.
- **CA-03:** SI el socio no asiste un día, ENTONCES el sistema DEBE reiniciar la racha a 0.
- **CA-04:** CUANDO el socio alcanza 7 días, el sistema DEBE mostrar un mensaje de felicitación.
- **CA-05:** SI no hay conexión, ENTONCES la web DEBE mostrar la última racha guardada con un aviso de "sin conexión".
- **CA-06:** La consulta de la racha DEBE responder en menos de 300 ms.

## Checklist de cierre
- [ ] Todos los RF tienen implementación verificable.
- [ ] Cada flujo de UC cubierto tiene al menos un CA, y cada CA su test.
- [ ] Cada edge case Must tiene su test.
- [ ] Review aprobada.
- [ ] 0 Open Questions.
