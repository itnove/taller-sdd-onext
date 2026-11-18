---
id: HU-02
feature: FEAT-02
titulo: "Congelar mi racha"
estado: en curso         # pendiente | en curso | bloqueada | hecha | descartada
rol: "socio"
modulos_afectados: [asistencia]
sprint: sprint-02
rama: "hu/HU-02-congelar-racha"
---

# HU-02: Congelar mi racha

## Historia
Como **socio**, quiero **congelar mi racha unos días cuando me voy de vacaciones o estoy lesionado**, para **no
perderla por una ausencia que no puedo evitar**.

## Contexto
HU única de FEAT-02. Atómica (se entrega sola sobre la racha v1 de HU-01), vertical (cálculo de la racha, datos, API y
web) y con valor (el socio deja de perder su racha por vacaciones o lesión). Cubre RN-01 a RN-09.

## Casos de uso

| UC | Flujos cubiertos | Fichero |
|---|---|---|
| UC-01 | A3, A4, A5 | `docs/05_modules/asistencia/casos-de-uso/UC-01-ver-racha.md` |
| UC-02 | P, A1, E1, E2, E3 | `docs/05_modules/asistencia/casos-de-uso/UC-02-congelar-racha.md` |
| UC-03 | P, E1 | `docs/05_modules/asistencia/casos-de-uso/UC-03-cancelar-congelacion.md` |

Los flujos P, A1, A2 y E1 de UC-01 los cubrió HU-01; esta HU los mantiene (la racha sin congelaciones es la de la v1).

## Criterios de aceptación
- [ ] Dado un socio con racha de 10 días, cuando congela una semana y no viene, entonces al volver sigue con 10 y, si
  viene, pasa a 11 _(UC-01 · A3)_.
- [ ] Dado un día congelado, cuando el socio viene ese día, entonces la racha suma 1 _(UC-01 · A4)_.
- [ ] Dado que hoy está congelado, cuando abre la app, entonces ve "Racha congelada hasta el dd/mm/aaaa" _(UC-01 · A5)_.
- [ ] Dado un rango válido desde hoy, cuando congela, entonces se guarda y ve cuántos días le quedan _(UC-02 · P, A1)_.
- [ ] Dado hoy, cuando intenta congelar empezando ayer o con el fin antes del inicio, entonces no se guarda
  _(UC-02 · E1)_.
- [ ] Dado un socio que ya ha congelado 5 días este año, cuando intenta congelar 3 más, entonces no se guarda y ve que
  le quedan 2 _(UC-02 · E2)_.
- [ ] Dado una congelación existente, cuando intenta otra que comparte un día, entonces no se guarda _(UC-02 · E3)_.
- [ ] Dado una congelación que aún no ha empezado, cuando la cancela, entonces sus días vuelven al cupo; si ya ha
  empezado, no se puede cancelar _(UC-03 · P, E1)_.

## Notas y dependencias
- **Depende de:** HU-01 (en `main`).
- **Bloquea:** nada.
- Fuera de esta historia: motivo, aprobación del gimnasio, avisos, congelar días pasados, editar una congelación y
  cupos por tipo de abono.

## Progreso SDD
- [x] PRD (`specs/PRD.md`): `/prd-writer`
- [x] Diseño técnico (`plans/TECHNICAL_DOC-backend.md`, `plans/TECHNICAL_DOC-frontend.md`): `/tech-design`
- [x] Tareas (`tasks/ROADMAP.md`): `/task-planner`
- [x] Implementación + integración: `/implementar-hu`
- [ ] Review (`review/REVIEW.md`): `/reviewer`
- [ ] Sync de módulos + merge local a `main`: `/module-sync`
