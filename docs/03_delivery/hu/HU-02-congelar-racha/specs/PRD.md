# HU-02: Congelar mi racha · PRD

## Info
- **HU:** HU-02 · **Feature:** FEAT-02
- **Scope:** fullstack
- **Módulos:** asistencia
- **Fecha:** 2026-11-18
- **Estado:** Ready · **Firma 2 (producto):** Nuria (PO), 2026-11-18

## Contexto

### Problema
Socios que pierden su racha por unas vacaciones o una lesión dejan de usarla y de venir (FEAT-02; métrica: −30 % de
rachas de 14 días o más que se rompen).

### Situación actual
La racha cuenta días seguidos con check-in y se rompe con un día completo sin venir
(`apps/api/src/modules/attendance/streak.ts:11`); no hay forma de congelarla.

### Resultado esperado
El socio congela unos días desde hoy en adelante, dentro de un cupo de 7 al año, y al volver conserva su racha;
mientras está congelada, la pantalla se lo dice. Puede cancelar una congelación que aún no ha empezado.

## Casos de uso

| UC · flujo | Descripción corta | CA |
|---|---|---|
| UC-02 · P | Congela un rango válido y ve los días que le quedan | CA-04 |
| UC-02 · A1 | Un rango que cruza de año cuenta cada día en su año | CA-02 |
| UC-02 · E1 | Fechas no válidas, hacia atrás o fin antes del inicio | CA-01 |
| UC-02 · E2 | Sin cupo: se dice cuántos días quedan | CA-02 |
| UC-02 · E3 | Solape con otra congelación activa | CA-03 |
| UC-03 · P | Cancela una congelación que aún no ha empezado | CA-07 |
| UC-03 · E1 | Ya ha empezado: no se cancela | CA-08 |
| UC-01 · A3 | Un día congelado sin check-in ni suma ni rompe | CA-05 |
| UC-01 · A4 | Venir un día congelado suma | CA-06 |
| UC-01 · A5 | Hoy congelado: "Racha congelada hasta el dd/mm/aaaa" | CA-09 |

Ficheros: `docs/05_modules/asistencia/casos-de-uso/UC-01-ver-racha.md`, `UC-02-congelar-racha.md` y
`UC-03-cancelar-congelacion.md`.

## Requisitos funcionales

| ID | Descripción | Prioridad | Scope | Criterios de aceptación |
|----|-------------|-----------|-------|-------------------------|
| RF-01 | **Congelar.** El socio crea una congelación `[inicio, fin]` desde hoy, sin solapes y dentro del cupo anual (RN-01 a RN-04, RN-09) | Must | backend | - [ ] CA-01<br>- [ ] CA-02<br>- [ ] CA-03<br>- [ ] CA-04 |
| RF-02 | **La racha respeta la congelación.** Los días congelados sin check-in se saltan; venir un día congelado suma; la consulta dice hasta cuándo está congelada hoy (RN-05, RN-06, RN-08) | Must | backend | - [ ] CA-05<br>- [ ] CA-06<br>- [ ] CA-10 |
| RF-03 | **Cancelar** una congelación que aún no ha empezado (RN-07) | Should | backend | - [ ] CA-07<br>- [ ] CA-08 |
| RF-04 | **Pantalla.** Formulario para congelar con errores junto a su campo, lista de congelaciones con "Cancelar" si no han empezado, días que quedan y el aviso de racha congelada (RN-08) | Must | frontend | - [ ] CA-09 |

## Requisitos no funcionales

| ID | Descripción | Categoría | Métrica concreta |
|----|-------------|-----------|------------------|
| RNF-01 | Rapidez | Rendimiento | La consulta de la racha responde en menos de 300 ms en local con 400 check-ins y 20 congelaciones |
| RNF-02 | Fronteras de fecha | Fiabilidad | 100 % de los casos en verde con el reloj inyectado: medianoche de Madrid, inicio hoy y ayer, 7 y 8 días, rango que cruza de año |
| RNF-03 | Accesibilidad | Accesibilidad | Los dos campos de fecha con `<label>`; los errores anunciados con `role="alert"` junto a su campo; el aviso de congelada, con `role="status"` |
| RNF-04 | Datos mínimos | Privacidad | 0 campos de motivo o texto libre en la tabla, en la API y en el formulario; un campo de más da 400 (RGPD §2) |

## Modelo de datos
Tabla nueva `freezes` (migración `002-create-freezes.sql`): `id`, `member_id` (FK a `members`), `start_day` y
`end_day` (`AAAA-MM-DD` de Madrid, con `end_day >= start_day`), `created_at` y `cancelled_at` (ISO UTC; `NULL` si está
activa). Cancelar no borra la fila. Sin columna de motivo.

## Interfaces / endpoints / pantallas

| Tipo | Ruta o pantalla | Cambio | Descripción |
|------|-----------------|--------|-------------|
| POST | /api/members/:id/freezes | Nuevo | Crea una congelación `{ start, end }` |
| GET | /api/members/:id/freezes | Nuevo | Congelaciones activas, días que quedan este año y el día de hoy |
| DELETE | /api/members/:id/freezes/:freezeId | Nuevo | Cancela una congelación que aún no ha empezado |
| GET | /api/members/:id/streak | Modificar | La racha se salta los días congelados y añade `frozenUntil` |
| Pantalla | Tu asistencia | Modificar | Aviso de congelada en el panel; sección "Congelar mi racha" con formulario, cupo y lista |

## Flujos de usuario
1. El socio elige su nombre; bajo la racha ve "Congelar mi racha", los días que le quedan y sus congelaciones.
2. Rellena "Desde" y "Hasta" y pulsa "Congelar": la lista y el cupo se actualizan; si hoy queda congelado, el panel lo
   dice.
3. Si algo no vale, ve el error junto al campo y no pierde lo escrito.
4. Pulsa "Cancelar" en una congelación futura: desaparece de la lista y el cupo sube.

## Datos personales
Escribe y lee los días que el socio no vendrá (inicio, fin, alta y cancelación) para no romper su racha (ejecución del
contrato, RGPD §3), mientras sea socio (§4). **Nunca el motivo ni ningún texto libre** (RGPD §2, RNF-04). Las
respuestas no incluyen el nombre del socio; nada en logs ni en mensajes de error.

## Edge cases

| ID | RF | Categoría | Situación | Comportamiento esperado |
|----|----|-----------|-----------|-------------------------|
| EC-01 | RF-01 | Input inválido | `2026-02-31`, `15/10/2026`, un número, campo vacío o ausente | 400 `VALIDATION_ERROR` con el campo en `details`, nada guardado (CA-01) |
| EC-02 | RF-01 | Boundary | Inicio hoy · inicio ayer | Hoy se guarda; ayer, 400 en `start` (CA-01) |
| EC-03 | RF-01 | Boundary | Exactamente 7 días en el año · 8 | 7 se guarda; 8, 409 `FREEZE_QUOTA_EXCEEDED` con `remainingDays` (CA-02) |
| EC-04 | RF-01 | Boundary | Del 30/12 al 02/01 | Cuenta 2 días en cada año (CA-02) |
| EC-05 | RF-01 | Concurrencia | Dos congelaciones solapadas enviadas a la vez | Solo entra una; la otra, 409 `FREEZE_OVERLAP` (CA-03) |
| EC-06 | RF-01 | Fallo de dependencia | La base falla al guardar | 500 `INTERNAL_ERROR` y nada a medias |
| EC-07 | RF-02 | Boundary | Congelación que empieza mañana | Hoy no cuenta como congelado; `frozenUntil` es `null` |
| EC-08 | RF-02 | Boundary | Días congelados y, antes, un hueco sin congelar | El hueco sigue rompiendo la racha |
| EC-09 | RF-02 | Datos corruptos | Socio sin congelaciones | Igual que la v1 (CA-10) |
| EC-10 | RF-02 | Datos corruptos | Congelación cancelada | No se salta: cuenta como si no existiera |
| EC-11 | RF-03 | Idempotencia | Cancelar dos veces | La segunda, 409 `FREEZE_ALREADY_CANCELLED`, sin cambios |
| EC-12 | RF-03 | Seguridad | Cancelar una congelación que no existe o de otro socio | 404 `FREEZE_NOT_FOUND` |
| EC-13 | RF-04 | Fallo de dependencia | La API no responde al congelar | Aviso de sin conexión; el formulario conserva lo escrito |
| EC-14 | RF-01 | Seguridad | Cuerpo con un campo de más (`reason: "lesión de rodilla"`) | 400 `VALIDATION_ERROR`, nada guardado (RNF-04) |
| EC-15 | RF-01 | Input inválido | Cuerpo que no es JSON, vacío o un array | 400 `VALIDATION_ERROR` |
| EC-16 | RF-01 | Idempotencia | Doble clic en "Congelar" | El botón se deshabilita mientras se envía; si llegaran dos, la segunda da 409 `FREEZE_OVERLAP` |

## Decisiones aplicables
- **DEC-04:** sin login; todo va sobre el socio del selector; la congelación de otro socio no se encuentra (EC-12).
- **DEC-06:** envelope con `details` en 400 y `remainingDays` en el 409 de cupo; schema estricto (`additionalProperties:
  false`).
- **DEC-07:** "hoy" y los días, de Madrid con el reloj inyectado.
- **DEC-08:** reglas puras (validar y cancelar) y leer, validar y escribir en una transacción sin `await` en medio
  (EC-05).

## Fuera de scope
- Motivo o justificante, aprobación del gimnasio, avisos o recordatorios, congelar días pasados, editar o acortar una
  congelación y cupos por tipo de abono (FEAT-02).

## Open Questions
No hay preguntas abiertas.

## Decisiones tomadas

| ID | Decisión | Razón | Impacto en el PRD | Fecha |
|----|----------|-------|-------------------|-------|
| DT-01 | Los días que quedan se muestran para el año de hoy | Es lo que el socio entiende como "este año" | RF-04 | 2026-11-18 |
| DT-02 | Cancelar no borra: marca la fecha de cancelación | Deja rastro sin guardar más datos | RF-03, modelo de datos | 2026-11-18 |

## Criterios de aceptación

| ID | Origen (UC · flujo o RF) | Dado | Cuando | Entonces |
|----|--------------------------|------|--------|----------|
| CA-01 | UC-02 · E1 / RF-01 | Hoy | Congela con el inicio antes de hoy, el fin antes del inicio o un día que no existe | Error del campo afectado y nada guardado |
| CA-02 | UC-02 · E2, A1 / RF-01 | 5 días congelados este año | Intenta congelar 3 más (o un rango que cruza de año y se pasa en uno) | No se guarda y se le dice cuántos le quedan ese año |
| CA-03 | UC-02 · E3 / RF-01 | Una congelación activa | Intenta otra que comparte un día | No se guarda |
| CA-04 | UC-02 · P / RF-01 | Un rango válido desde hoy | Congela | Se guarda y ve los días que le quedan en el año del inicio |
| CA-05 | UC-01 · A3 / RF-02 | Racha de 10 y una semana congelada sin venir | Abre la app al volver | Sigue con 10; si viene, 11 |
| CA-06 | UC-01 · A4 / RF-02 | Un día congelado | Hace check-in ese día | La racha suma 1 |
| CA-07 | UC-03 · P / RF-03 | Una congelación que empieza la semana que viene | La cancela | Se cancela y sus días vuelven al cupo |
| CA-08 | UC-03 · E1 / RF-03 | Una congelación que ya ha empezado | Intenta cancelarla | No se cancela |
| CA-09 | UC-01 · A5 / RF-04 | Hoy está congelado | Abre la app | Ve su racha y "Racha congelada hasta el dd/mm/aaaa" |
| CA-10 | RF-02 (INV-03) | Un socio sin congelaciones | Consulta su racha | Es la misma que en la v1 (HU-01) |

En notación EARS (como en el curso):

- **CA-01** _(RN-01, RN-02)_: SI el inicio es anterior a hoy, el fin es anterior al inicio o alguna fecha no es un día
  de calendario válido, ENTONCES el sistema DEBE rechazar la congelación con un error del campo afectado y no guardar
  nada.
- **CA-02** _(RN-03)_: SI la congelación haría pasar de 7 los días congelados del socio en algún año natural, ENTONCES el
  sistema DEBE rechazarla e indicar cuántos días le quedan ese año.
- **CA-03** _(RN-04)_: SI la congelación comparte algún día con otra no cancelada del socio, ENTONCES el sistema DEBE
  rechazarla.
- **CA-04** _(RN-01 a RN-03)_: CUANDO el socio congela un rango válido, el sistema DEBE guardarlo y devolver los días que
  le quedan en el año del inicio.
- **CA-05** _(RN-05)_: MIENTRAS un día esté congelado y sin check-in, el sistema DEBE saltarlo al contar la racha, sin
  sumar ni romperla.
- **CA-06** _(RN-06)_: CUANDO el socio hace check-in en un día congelado, el sistema DEBE sumarlo a la racha como
  cualquier otro día.
- **CA-07** _(RN-07)_: CUANDO el socio cancela una congelación que aún no ha empezado, el sistema DEBE cancelarla y
  devolver sus días al cupo.
- **CA-08** _(RN-07)_: SI la congelación ya ha empezado, ENTONCES el sistema DEBE rechazar su cancelación.
- **CA-09** _(RN-08)_: MIENTRAS hoy esté congelado, la pantalla DEBE mostrar "Racha congelada hasta el dd/mm/aaaa"
  junto a la racha.
- **CA-10** _(INV-03)_: El sistema DEBE calcular la racha de un socio sin congelaciones igual que en la v1 (HU-01).

## Checklist de cierre
- [ ] Todos los RF tienen implementación verificable.
- [ ] Cada flujo de UC cubierto tiene al menos un CA, y cada CA su test.
- [ ] Cada edge case Must tiene su test.
- [ ] Review aprobada.
- [ ] 0 Open Questions.
