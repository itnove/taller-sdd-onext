---
sprint: 01
objetivo: "El socio elige su nombre, hace check-in y ve su racha de asistencia."
inicio: 2026-11-16
fin: 2026-11-17            # por defecto, inicio + 1 (2 días)
estado: en curso           # planificado | en curso | completado | cerrado
base: e1825af                # sha de main al abrir el sprint; /audit-sprint audita base..main
cerrado_en: null
audit-override: null       # solo con razón ≥ 20 caracteres
---

# sprint-01 (2026-11-16 - 2026-11-17)

## Objetivo
Al final del sprint, el socio elige su nombre en GymApp, hace check-in y ve su racha de asistencia, con sus estados
(vacío, con racha, felicitación y sin conexión).

## Resumen de estado
- HU: hechas 0 / total 1 · tareas sin HU: hechas 0 / 2 · bloqueadas 0
- Última actualización: 2026-11-16 10:00

## Historias de usuario

### HU-01 · Ver mi racha de asistencia · estado: pendiente
- **Origen:** FEAT-01 · **Depende de:** T-01, T-02 · **Rama:** `hu/HU-01-racha`
- [ ] prd-writer
- [ ] tech-design
- [ ] task-planner
- [ ] implementar-hu
- [ ] reviewer
- [ ] merge a main
- [ ] module-sync

## Tareas sin HU

### T-01 · Socios y check-ins en la API · estado: pendiente
- **Tipo:** infraestructura del módulo `asistencia` (sin nada que preguntar ni aceptar: WORKFLOW §9)
- Migración de `members` y `check_ins`, seed inventado (Lucía, Tomás, Irene y Pau), `GET /api/members` y
  `POST /api/members/:id/checkins` (el día de Madrid con el reloj inyectado; varios el mismo día cuentan uno).
  Brief: [sprint-01/T-01-BRIEF.md](sprint-01/T-01-BRIEF.md).

### T-02 · Elegir socio y hacer check-in en la web · estado: pendiente
- **Tipo:** infraestructura del módulo `asistencia`
- Selector "Socio" y botón "Hacer check-in hoy" con su aviso, sobre la API de T-01, y el smoke de Playwright al día.
  Brief: [sprint-01/T-02-BRIEF.md](sprint-01/T-02-BRIEF.md).

## Orden de ejecución
1. T-01 (sin dependencias)
2. T-02 (depende de T-01)
3. HU-01 (depende de T-01 y T-02)

## Recordatorio de reglas de oro
- Cero asunciones; ninguna etapa SDD se salta; brief obligatorio; integración ejecutada.
- Techo: 2 ciclos de arreglo por task y 2 "Requiere cambios" por HU.
- Ningún sprint se cierra sin `/audit-sprint` aprobado.

## Notas
- Sprint de 2 días (hoy y mañana), abierto por Nuria el 2026-11-16.
