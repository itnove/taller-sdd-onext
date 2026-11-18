---
id: IDEA-001
titulo: "Racha de asistencia"
estado: completada          # idea | aceptada | descartada | completada
fecha: 2026-11-16
autor: "Nuria (PO de GymTonic)"
modulos_afectados: [asistencia]
prioridad: alta
feature: FEAT-01
completada_en: 2026-11-17
---

# IDEA-001: Racha de asistencia

## Descripción
Mostrar al socio cuántos días seguidos ha venido al gimnasio, para reforzar la constancia.

## Problema u oportunidad
Muchos socios dejan de venir en las primeras semanas y nadie se da cuenta hasta que se dan de baja. Ver su racha puede
animarles a no romperla. Beneficia al socio (constancia) y al gimnasio (retención).

## Alcance (grano grueso)
Módulo `asistencia`: cálculo a partir de los check-ins, API y web.

## Notas
Dudas iniciales:
- ¿Qué es "un día": 24 horas o el día de calendario? ¿En qué zona horaria?
- ¿Qué pasa con dos check-ins el mismo día?
- Si hoy aún no ha venido, ¿la racha ya se ha roto?
- ¿Hay algún premio o mensaje al llegar a una cifra?
- ¿Qué ve el socio si no hay conexión?
- ¿Qué queda fuera de esta primera versión?

Los días de asistencia son datos personales: ver [RGPD.md](../../../RGPD.md).

## Decisión
Aceptada el 2026-11-16 tras el shaping: [FEAT-01](../../features/completadas/FEAT-01-racha/feature.md). Entregada en el sprint-01 (HU-01).
