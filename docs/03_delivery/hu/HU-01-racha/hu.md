---
id: HU-01
feature: FEAT-01
titulo: "Ver mi racha de asistencia"
estado: en curso         # pendiente | en curso | bloqueada | hecha | descartada
rol: "socio"
modulos_afectados: [asistencia]
sprint: sprint-01
rama: "hu/HU-01-racha"
---

# HU-01: Ver mi racha de asistencia

## Historia
Como **socio**, quiero **ver cuántos días seguidos he venido al gimnasio**, para **motivarme a no romper la racha**.

## Contexto
HU única de FEAT-01. Atómica (se entrega sola sobre los check-ins de T-01 y T-02), vertical (cálculo, API y web) y con
valor (el socio ve su racha desde el primer día). Cubre RN-01 a RN-06.

## Casos de uso

| UC | Flujos cubiertos | Fichero |
|---|---|---|
| UC-01 | P, A1, A2, E1 | `docs/05_modules/asistencia/casos-de-uso/UC-01-ver-racha.md` |

Cubre todos los flujos de UC-01.

## Criterios de aceptación
- [ ] Dado un socio con 4 días seguidos, cuando hace check-in hoy, entonces la racha muestra 5 días _(UC-01 · P)_.
- [ ] Dado un socio que vino ayer pero hoy no, cuando abre la app, entonces su racha cuenta desde ayer _(UC-01 · P)_.
- [ ] Dado un socio que faltó anteayer y ayer, cuando abre la app, entonces su racha es 0 _(UC-01 · A1)_.
- [ ] Dado un socio sin check-ins, cuando abre la app, entonces ve "Empieza tu racha hoy" _(UC-01 · A1)_.
- [ ] Dado un socio que llega a 7 días, cuando abre la app, entonces ve la felicitación _(UC-01 · A2)_.
- [ ] Dado que la API no responde, cuando abre la app, entonces ve su última racha guardada y el aviso _(UC-01 · E1)_.

## Notas y dependencias
- **Depende de:** T-01 y T-02 del sprint-01 (socios y check-ins).
- **Bloquea:** nada.
- Fuera de esta historia: todo lo que la feature deja fuera (push, congelar, ranking, check-in retroactivo, historial)
  y el check-in sin conexión.

## Progreso SDD
- [x] PRD (`specs/PRD.md`): `/prd-writer`
- [ ] Diseño técnico (`plans/TECHNICAL_DOC.md`): `/tech-design`
- [ ] Tareas (`tasks/ROADMAP.md`): `/task-planner`
- [ ] Implementación + integración: `/implementar-hu`
- [ ] Review (`review/REVIEW.md`): `/reviewer`
- [ ] Sync de módulos + merge local a `main`: `/module-sync`
