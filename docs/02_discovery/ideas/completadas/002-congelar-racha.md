---
id: IDEA-002
titulo: "Congelar la racha"
estado: completada          # idea | aceptada | descartada | completada
fecha: 2026-11-18
autor: "Nuria (PO de GymTonic)"
modulos_afectados: [asistencia]
prioridad: alta
feature: FEAT-02
completada_en: 2026-11-18
---

# IDEA-002: Congelar la racha

## Descripción
Que el socio pueda congelar su racha cuando se va de vacaciones o tiene una lesión, para no perderla por no poder
venir.

## Problema u oportunidad
Desde que salió la racha, recepción recibe quejas de socios que la han perdido por una semana de vacaciones o por una
lesión. Algunos dicen que ya no les motiva empezar de cero. Era una de las cosas que la racha v1 dejó fuera de alcance.

## Alcance (grano grueso)
Módulo `asistencia`: el cálculo de la racha, la API y la web.

## Notas
Dudas iniciales:
- ¿Cuántos días se puede congelar? ¿Por año, por congelación, sin límite?
- ¿Se puede congelar hacia atrás, para un día que ya pasó?
- ¿Mientras está congelada, la racha suma, se queda igual o se rompe?
- ¿Y si el socio viene al gimnasio un día que tenía congelado?
- ¿Se puede cancelar o cambiar una congelación?
- ¿Hace falta justificar el motivo o que lo apruebe el gimnasio?
- ¿Qué ve el socio en la pantalla mientras su racha está congelada?
- ¿Cómo sabremos si ha servido?

## Decisión
Aceptada el 2026-11-18 tras el shaping: [FEAT-02](../../features/completadas/FEAT-02-congelar-racha/feature.md). Entregada en el sprint-02 (HU-02).
