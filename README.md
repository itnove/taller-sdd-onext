# Taller SDD · GymApp (versión stack onext)

Repositorio de prácticas del curso **[Spec-Driven Development](https://www.itnove.com/curso/spec-driven-development)
de ITNOVE**, en su **versión "stack onext"**: GymApp, la app de los socios de GymTonic (una cadena de gimnasios
inventada), construida con un flujo de agentes de la idea al código integrado. Racha de asistencia entregada y
práctica "congelar la racha" paso a paso, por etiquetas. Todos los datos son inventados.

> **¿Buscas la versión sencilla?** Está en [github.com/itnove/taller-sdd-gymapp](https://github.com/itnove/taller-sdd-gymapp):
> **mismo producto, mismas etiquetas y la misma práctica**, con un stack ligero (Node sin framework, web estática,
> datos en un JSON). Esta versión usa el stack y el kit completo del taller de onext: monorepo con Fastify, SQLite,
> React y Playwright, sprints, casos de uso, auditorías y 10 agentes. Elige una de las dos: el curso funciona igual.

## Requisitos

- **Node 22.18 o superior (recomendado 24 LTS)**, npm y git. Por qué esa versión: [docs/SETUP.md](docs/SETUP.md).
- Tu agente de código (Claude Code, GitHub Copilot, OpenCode, Cursor, Codex…). El kit trae skills, agentes y hooks
  para Claude Code; con otro agente, `AGENTS.md` y las skills en `.claude/skills/` sirven como instrucciones.
- Puertos 3001 y 5173 libres. No hace falta ninguna clave: el repositorio no llama a ningún modelo de IA.

## Arranque en 3 comandos

```bash
npm ci
npx playwright install chromium
npm run db:reset && npm run dev
```

Abre <http://127.0.0.1:5173>. Para comprobarlo todo: `npm run check:env` (el portátil) e `npm run integrate`
(typecheck, lint, tests, e2e y kit, en serie y con logs). Clona con git, no con "Download ZIP": sin el historial no hay
etiquetas que recorrer.

## Las etiquetas

| Etiqueta | Qué contiene |
|---|---|
| `paso-0-kit` | El kit SDD (`AGENTS.md`, `CLAUDE.md`, 12 skills, 10 agentes, hooks, 15 plantillas, `docs/`) y el esqueleto del monorepo |
| `paso-1-racha-v1` | Racha de asistencia v1: idea, feature, casos de uso, HU-01 y el sprint-01 entregado, auditado y cerrado |
| `punto-de-partida` | Lo anterior más la idea cruda de la práctica: congelar la racha |
| `taller-1-feature` | La feature analizada sin asunciones (respuestas de Nuria, la PO), sus casos de uso y la HU-02 |
| `taller-2-prd` | El PRD de HU-02 con sus 10 criterios de aceptación |
| `taller-3-tareas` | Diseño técnico (backend y frontend) y tareas con su brief |
| `taller-4-implementada` | El código y los tests, un commit por tarea |
| `taller-5-hecho` | Revisión en dos rondas, registro de cambios, documentación del módulo, auditoría y cierre del sprint-02 |

## Dónde empezar

1. [AGENTS.md](AGENTS.md): el repositorio en una página (comandos, flujo y reglas de oro).
2. [docs/CONSTITUCION.md](docs/CONSTITUCION.md) y [docs/WORKFLOW.md](docs/WORKFLOW.md): los principios y el flujo
   completo, con las cuatro firmas.
3. El rastro de la racha v1: `docs/03_delivery/hu/completadas/HU-01-racha/`.
4. La práctica: `git switch -c mi-practica punto-de-partida` y recorre la cadena desde
   `docs/02_discovery/ideas/002-congelar-racha.md`, comparando cada paso con su etiqueta `taller-N`.

## Licencias

- **Código, kit, plantillas y configuración** (`apps/`, `e2e/`, `scripts/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`,
  `docs/_templates/` y los ficheros de configuración): **MIT** ([LICENSE](LICENSE)).
- **Prosa de la documentación** (`docs/`) **y este README**: **CC BY 4.0**.
- El detalle por ruta y la atribución, en [NOTICE](NOTICE).

## Inspiración y adaptación

Este repositorio **adapta el stack, el flujo, las plantillas, las skills, los agentes, los hooks y los scripts** del
taller de onext "Ata en corto a tus agentes: SDD en directo" (TRGCON 2026):
[github.com/onext-lab/taller-trgcon26-sdd](https://github.com/onext-lab/taller-trgcon26-sdd). La prosa adaptada es
"Taller SDD · ATS de ejemplo", de onext technology, bajo CC BY 4.0; el código y el kit, Copyright (c) 2026 onext
technology, bajo MIT. Cambios: se ha pasado del caso ATS (ofertas, candidatos e inscripciones) al caso GymApp (socios,
check-ins, racha y congelación), con un solo módulo, una constitución y una nota de RGPD propias. Gracias a onext por
publicarlo en abierto.
