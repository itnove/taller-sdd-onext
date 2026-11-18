# Estado del MVP por módulo

Vista única de qué hay hecho en cada módulo de GymApp. La fila de cada módulo la actualiza `/module-sync` al cerrar
cada HU; el detalle vive en `docs/05_modules/{módulo}/functional.md`.

- **Última actualización:** 2026-11-16 (paso-0-kit: solo el esqueleto, sin HU entregadas).

## Leyenda

| Símbolo | Significado |
|---|---|
| ✅ | Implementado, probado y con review aprobada |
| 🚧 | Parcial o con huecos conocidos |
| ⬜ | Sin empezar |

## Resumen

| Módulo | Estado | Capacidades ✅ / total | HU entregadas | Notas |
|---|---|---|---|---|
| [`asistencia`](05_modules/asistencia/functional.md) | ⬜ | 0 / 0 | - | Pendiente de la primera HU |

## Transversal

| Pieza | Estado | Notas |
|---|---|---|
| Esqueleto del monorepo (`GET /api/health`, reloj, días de Madrid, errores, web, e2e smoke) | ✅ | Infraestructura sin HU (ver [WORKFLOW.md](WORKFLOW.md) §9) |
