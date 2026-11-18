# Puesta a punto del portátil

Lo que necesitas antes de empezar la práctica y cómo comprobarlo.

## Requisitos

| Requisito | Versión | Para qué |
|---|---|---|
| **Node.js** | **22.18 o superior; recomendado 24 LTS** | API, web, tests, hooks de Claude Code y scripts |
| npm | la que trae Node | instalar dependencias (workspaces) |
| git | ≥ 2.30 | ramas por HU y etiquetas por fase |
| Chromium de Playwright | el que instala `npx playwright install chromium` | e2e y QA |
| Tu agente de código | el que uses (Claude Code, GitHub Copilot, OpenCode, Cursor, Codex…) | ejecutar el flujo |
| Puertos libres | 3001 (API) y 5173 (web); 3101 y 5174 para los e2e | `npm run dev` y los e2e |

No hace falta Docker, ni Python, ni base de datos instalada, ni ninguna clave: la base de datos es un fichero SQLite que
crea el propio Node, y el repositorio no llama a ningún modelo de IA.

## Por qué "Node 22.18+, recomendado 24 LTS"

El repositorio usa dos capacidades de Node que llegaron en momentos distintos:

- **`node:sqlite`**, el SQLite que viene dentro de Node (sin binarios que compilar ni dependencias nativas), funciona
  **sin ningún flag desde la v22.13.0**. En Node 22 sigue marcado como experimental y avisa al cargarse
  (`ExperimentalWarning: SQLite is an experimental feature`); en Node 24 está en *release candidate* desde la v24.15.0
  y no avisa. Fuente: [documentación de `node:sqlite`](https://nodejs.org/docs/latest-v24.x/api/sqlite.html).
- **Ejecutar TypeScript directamente** (*type stripping*: la API arranca con `node src/server.ts`, sin compilar) está
  activado **por defecto desde la v22.18.0** (y en toda la 24). Con una 22 anterior, la API no arranca.

Por eso el mínimo real es **22.18** y no 22.13: con 22.13-22.17 la base de datos funcionaría, pero la API no. Y se
recomienda **24 LTS** porque es la LTS activa, `node:sqlite` no avisa y es la versión con la que se construyó el kit
del taller de onext del que nace este repositorio. Se ha comprobado entero (tests, tipos, lint y e2e) con Node 22.23.

`package.json` lo declara en `engines.node` (`>=22.18`) y `.nvmrc` fija `24`, la recomendada.

## Cómo instalar Node

Elige una de las tres vías:

- **nvm** (macOS y Linux): `nvm install 24 && nvm use 24`. En la raíz del repo basta `nvm use`, que lee `.nvmrc`.
- **fnm** (macOS, Linux y Windows): `fnm install 24 && fnm use 24`.
- **Instalador oficial**: descarga la versión **LTS 24.x** de <https://nodejs.org> e instálala.

Comprueba con `node -v`: debe ser **v22.18.0 o superior** (mejor, `v24.`).

## Arranque en 3 comandos

```bash
npm ci                              # dependencias exactas del package-lock.json
npx playwright install chromium     # solo Chromium (descarga grande: hazlo antes de empezar)
npm run db:reset && npm run dev     # crea data/gymapp.db y levanta API (:3001) y web (:5173)
```

Abre <http://127.0.0.1:5173>: tienes que ver "GymApp".

## Comprobación: `npm run check:env`

`npm run check:env` (`scripts/check-env.mjs`) revisa la versión de Node, que los puertos 3001 y 5173 estén libres, que
las dependencias estén instaladas y que esté el Chromium de Playwright. Si algo falla, te dice en castellano qué hacer.

Después, `npm run check:harness` comprueba que el kit (`.claude/` y `docs/`) está completo, y `npm run integrate`
ejecuta en serie typecheck, lint, tests, e2e y `check:harness`, con los logs en `logs/integrate/`.

## Versiones fijadas que conviene conocer

- **TypeScript 6.0.3, no 7.x.** `typescript-eslint` 8.71 exige `typescript < 6.1`; con la 7.x el lint deja de
  funcionar. Detalle en [DECISIONS.md](07_architecture_principles/DECISIONS.md) (DEC-05).
- Todas las dependencias van fijadas sin `^`: `npm ci` instala exactamente lo mismo en todos los portátiles.

## Problemas frecuentes

| Síntoma | Qué hacer |
|---|---|
| `node -v` muestra v20 o una 22 anterior a la 22.18 | Activa la 24: `nvm use 24` o `fnm use 24`, y abre una terminal nueva. |
| `ERR_UNKNOWN_FILE_EXTENSION ".ts"` al arrancar la API | Tu Node no ejecuta TypeScript: necesitas 22.18 o superior. |
| `check:env` dice que un puerto está ocupado | Cierra el `npm run dev` que tengas abierto en otra terminal. |
| Los e2e no encuentran el navegador | `npx playwright install chromium`. |
| La base de datos tiene datos raros | `npm run db:reset` la regenera desde el esquema, las migraciones y el seed. |
