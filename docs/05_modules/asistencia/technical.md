# Módulo `asistencia` (código `attendance`): Técnico

Foto técnica para los architects. Lo mantiene `/module-sync`; lo funcional está en [functional.md](functional.md).

## Estructura de código

Todavía no existe `apps/api/src/modules/attendance/` ni `apps/web/src/features/attendance/`: se crean con la primera
tarea del módulo. Lo transversal que ya hay está en [ARCHITECTURE.md](../../ARCHITECTURE.md).

## Tablas y migraciones

Ninguna (solo `schema_migrations`, de `apps/api/src/db/schema.sql`).

## Endpoints

| Método y ruta | Respuesta |
|---|---|
| `GET /api/health` | `{ status: "ok" }` (transversal) |
