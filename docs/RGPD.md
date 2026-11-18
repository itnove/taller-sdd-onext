# RGPD en GymApp: EJEMPLO DIDÁCTICO

> **⚠️ EJEMPLO DIDÁCTICO.** Este documento es material del curso de SDD: describe cómo trataría GymApp, la app de una
> cadena de gimnasios **ficticia** (GymTonic), los datos personales de sus socios, para que las features y los
> auditores tengan reglas concretas que cumplir. **No es asesoría jurídica** ni sustituye el análisis de un delegado de
> protección de datos. Las bases jurídicas y los plazos son supuestos razonables elegidos para el ejemplo. Todos los
> datos del repo son inventados.

Es la referencia del agente `datos-personales-auditor`, que lo usa en cada review (`/reviewer`) y en cada auditoría de
sprint (`/audit-sprint`). Lo cita el principio 3 de la [constitución](CONSTITUCION.md): datos mínimos.

## 1. Qué datos tratamos

| Dato | Entidad | ¿Necesario? | Para qué |
|---|---|---|---|
| Nombre | `Member` | Sí | Que el socio se reconozca en el selector |
| Días con check-in | `CheckIn` | Sí | Calcular la racha de asistencia |
| Rangos de días congelados (inicio, fin, cancelación) | `Freeze` | Sí | Que la racha no se rompa en esos días |
| Última racha mostrada (en el navegador) | `localStorage` | Sí | Enseñarla sin conexión (§6) |

**Socios y check-ins son datos personales**: dicen quién es la persona y qué días va al gimnasio. Por eso se tratan con
el mismo cuidado que cualquier otro dato personal, aunque parezcan inocentes.

**No se recogen**: email, teléfono, fecha de nacimiento, foto, ubicación ni ningún dato de categoría especial. En
particular, **ningún dato de salud** (art. 9 RGPD).

## 2. El motivo de la congelación queda fuera de alcance

Un socio congela su racha por vacaciones, por trabajo… o por una lesión, una baja médica o un embarazo. **El motivo
puede revelar datos de salud**, que son categoría especial y exigirían una base jurídica reforzada, medidas de
seguridad adicionales y probablemente una evaluación de impacto.

**Decisión (Nuria, PO, con el responsable de datos):** GymApp **no pide ni guarda el motivo** de una congelación, ni
justificante, ni ningún campo de texto libre donde el socio pueda escribirlo. Congelar es un rango de fechas y nada más.

- La API rechaza con `400 VALIDATION_ERROR` cualquier campo que no sea el rango (`additionalProperties: false`).
- El formulario no tiene campo de motivo ni de comentarios.
- Si una feature futura quisiera el motivo, es una decisión nueva: abre una pregunta a producto y un `DEC-NN`, y este
  documento se actualiza **antes** de escribir el PRD.

## 3. Base jurídica (supuesto del ejemplo)

- **Ejecución del contrato de socio** (art. 6.1.b RGPD): el check-in es el control de acceso del gimnasio y la racha y
  la congelación son funciones del servicio que el socio usa en su app.
- No hay perfilado ni decisiones automatizadas: la racha es un recuento que solo ve el propio socio.

## 4. Retención y supresión

| Dato | Plazo de conservación (supuesto) | Al vencer o al darse de baja |
|---|---|---|
| Socio | Mientras sea socio | Se borra con sus check-ins y congelaciones |
| Check-ins | Mientras sea socio | Se borran |
| Congelaciones, también las canceladas | Mientras sea socio | Se borran |

La baja del socio la gestiona el gimnasio fuera de la app en esta versión. Una tabla nueva con datos del socio se añade
a este inventario (§1) y a esta tabla en la misma HU que la crea.

## 5. Derechos del socio

| Derecho | Qué hace GymApp hoy |
|---|---|
| Acceso (art. 15) | El socio ve su racha y sus congelaciones; el detalle de check-ins lo da el gimnasio |
| Rectificación (art. 16) | Una congelación futura se puede cancelar; los check-ins los corrige el gimnasio |
| Supresión (art. 17) | Con la baja (§4) |

## 6. Reglas técnicas que vigila el auditor

1. **Nada de datos personales en logs, mensajes de error ni respuestas que no los necesitan.** Los logs de Fastify no
   registran cuerpos de petición, y el serializador de `apps/api/src/logger.ts` quita la query de la URL y la IP de
   origen; lo comprueba `apps/api/test/logger.test.ts`.
2. **Minimización** en las respuestas: el selector de socios recibe solo `id` y nombre; la racha de un socio no
   incluye la lista de sus check-ins.
3. **En el navegador** (`localStorage`) solo se guarda, por socio, **la última racha mostrada y el día al que
   corresponde**, con la clave `gymapp:streak:<id>`. Nunca el nombre, la lista de días ni las congelaciones. Es lo único
   que se permite guardar en el navegador.
4. **Seeds, fixtures y tests con datos inventados**; nunca personas reales ni datos de salud.
5. **Toda HU que toque datos de socios** declara en su PRD qué datos, para qué y cuánto tiempo.
