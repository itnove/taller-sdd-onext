# Arquitectura de GymApp

Backbone corto de GymApp. Las decisiones que lo fijan están en
[DECISIONS.md](07_architecture_principles/DECISIONS.md); el detalle de cada módulo, en `docs/05_modules/{módulo}/`
(lo mantiene `/module-sync`).

## Qué es

La app de los socios de **GymTonic**, una cadena de gimnasios inventada: el socio elige su nombre, hace **check-in**
y ve su **racha de asistencia**; en la práctica del curso, además, **congela la racha** unos días. Un único rol, el
**socio**, sin login (DEC-04). Todos los datos son inventados.

## Piezas

```
navegador ──► apps/web (React + Vite, :5173) ──/api (proxy de Vite)──► apps/api (Fastify, :3001) ──► data/gymapp.db (node:sqlite)
                                                                         ▲
e2e/ (Playwright, Chromium) ─────────────── levanta api + web ───────────┘   (con data/e2e.db, :3101 y :5174)
```

| Pieza | Ruta | Responsabilidad |
|---|---|---|
| API | `apps/api/src/` | Rutas REST bajo `/api`, validación con JSON Schema, reglas de negocio y acceso a datos |
| Arranque de la API | `apps/api/src/app.ts`, `apps/api/src/server.ts` | `buildApp({ db, now })` para tests (`fastify.inject`) y `server.ts` para escuchar en `127.0.0.1` |
| Transversal de la API | `apps/api/src/clock.ts`, `apps/api/src/calendar.ts`, `apps/api/src/errors.ts`, `apps/api/src/http/` | Reloj inyectado, días de Madrid, errores y validación (DEC-06, DEC-07) |
| Base de datos | `apps/api/src/db/` | `connection.ts`, `schema.sql`, `migrations/`, `migrate.ts`, `transaction.ts`, `seed.ts`, `reset.ts` |
| Web | `apps/web/src/` | Pantallas por feature y componentes compartidos (`components/`: cliente HTTP, mensajes, formatos) |
| E2E | `e2e/` | Smoke y flujos de usuario en Chromium |
| Scripts | `scripts/` | `dev`, `integrate`, `check:env`, `check:harness`, `next-id` |

## Módulos

| Módulo (docs) | Código API | Código web | Entidades |
|---|---|---|---|
| asistencia | `apps/api/src/modules/attendance/` | `apps/web/src/features/attendance/` | `Member`, `CheckIn` y, con la práctica, `Freeze` |

La carpeta de código se crea con la primera tarea que la necesita. El mapa vivo está en [_modules.md](_modules.md).

## Convenciones

- **Capas en la API, por módulo** (DEC-08): `routes.ts` (rutas y JSON Schema) → `service.ts` (reglas de negocio) →
  `repository.ts` (SQL con sentencias preparadas). Las rutas no tocan SQL; los repositorios no conocen HTTP. Las reglas
  de cálculo (la racha, una congelación) son funciones puras que reciben "hoy".
- **Errores:** envelope uniforme `{ error: { code, message, details? } }` con códigos estables (DEC-06). Nunca *stack
  traces* ni datos personales en la respuesta.
- **Fechas:** instantes en ISO 8601 UTC; días de calendario `AAAA-MM-DD` de Europe/Madrid, calculados con el reloj
  inyectado (DEC-07).
- **IDs:** enteros autoincrementales de SQLite.
- **Esquema:** cada cambio de modelo es una migración nueva en `apps/api/src/db/migrations/` (DEC-03).
- **Web:** una carpeta por feature con sus componentes, su cliente de API y sus tipos; los componentes reutilizables,
  en `apps/web/src/components/`. Accesibilidad: roles y etiquetas que Testing Library y Playwright usan como selectores.
- **Datos personales:** se tratan según [RGPD.md](RGPD.md): minimización y sin datos de salud.
