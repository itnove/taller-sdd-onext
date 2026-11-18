---
sprint: 02
objetivo: "El socio congela su racha unos días y no la pierde."
inicio: 2026-11-18
fin: 2026-11-19            # por defecto, inicio + 1 (2 días)
estado: en curso           # planificado | en curso | completado | cerrado
base: 4c81cbc                # sha de main al abrir el sprint; /audit-sprint audita base..main
cerrado_en: null
audit-override: null       # solo con razón ≥ 20 caracteres
---

# sprint-02 (2026-11-18 - 2026-11-19)

## Objetivo
Al final del sprint, el socio congela un rango de días desde hoy, dentro de un cupo de 7 al año, cancela una
congelación que aún no ha empezado y, al volver, conserva su racha; mientras está congelada, la pantalla se lo dice.
Es la práctica del curso.

## Resumen de estado
- HU: hechas 0 / total 1 · bloqueadas 0
- Última actualización: 2026-11-18 10:00

## Historias de usuario

### HU-02 · Congelar mi racha · estado: pendiente
- **Origen:** FEAT-02 · **Depende de:** HU-01 (en `main`) · **Rama:** `hu/HU-02-congelar-racha`
- [ ] prd-writer
- [ ] tech-design
- [ ] task-planner
- [ ] implementar-hu
- [ ] reviewer
- [ ] merge a main
- [ ] module-sync

## Tareas sin HU
_Ninguna._

## Orden de ejecución
1. HU-02 (depende de HU-01, ya en `main`)

## Recordatorio de reglas de oro
- Cero asunciones; ninguna etapa SDD se salta; brief obligatorio; integración ejecutada.
- Techo: 2 ciclos de arreglo por task y 2 "Requiere cambios" por HU.
- Ningún sprint se cierra sin `/audit-sprint` aprobado.

## Notas
- Sprint de 2 días (hoy y mañana), abierto por Nuria el 2026-11-18.
