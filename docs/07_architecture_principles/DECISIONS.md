# Decisiones de arquitectura (DEC-NN)

Registro de las decisiones que condicionan el diseño de cualquier HU. Las consultan `/prd-writer` (sección *Decisiones
aplicables*), `/tech-design` y `/reviewer`. Una decisión nueva o un cambio abre el siguiente `DEC-NN`; las antiguas no
se borran: se marcan `Sustituida por DEC-NN`.

Formato: **Contexto · Decisión · Alternativas · Consecuencias · Estado**.

---

## DEC-01 · Stack TypeScript: Fastify, `node:sqlite` y React + Vite

- **Contexto.** Repositorio de prácticas que tiene que arrancar en portátiles ajenos (macOS, Linux y Windows) sin
  servicios externos ni binarios que compilar, y ser legible en un curso.
- **Decisión.** TypeScript estricto en todo el repo. API con **Fastify 5** (validación con JSON Schema por ruta y
  `fastify.inject` para tests). Persistencia con **`node:sqlite`** (`DatabaseSync`) sobre `data/gymapp.db`. Web con
  **React 19 + Vite**. Tests con **Vitest** (api y web) y **Playwright** solo con Chromium (e2e). La API ejecuta
  TypeScript directamente con el *type stripping* de Node (sin paso de compilación).
- **Alternativas.** Express (sin validación por esquema de serie); `better-sqlite3` (binario nativo que compila en la
  instalación y falla en portátiles sin toolchain); Postgres en Docker (requisito de más para el asistente); Next.js
  (más conceptos de los que el curso necesita). La versión sencilla del repositorio
  (`itnove/taller-sdd-gymapp`) usa `node:http` y una web estática: aquí se elige el stack del taller de onext..
- **Consecuencias.** Requiere **Node 22.18 o superior; recomendado 24 LTS** ([SETUP.md](../SETUP.md)). `node:sqlite` es síncrono: basta para
  un único usuario local. Errores de la API con envelope uniforme `{ error: { code, message, details? } }`.
- **Estado.** Aceptada (2026-11-16).

## DEC-02 · Monorepo con npm workspaces

- **Contexto.** API, web y e2e comparten versiones de TypeScript, ESLint y Prettier, y el asistente tiene que
  arrancarlo todo con un comando.
- **Decisión.** Un único repo con **npm workspaces** (`apps/api`, `apps/web`) y `e2e/` en la raíz. Scripts raíz:
  `dev`, `build`, `test`, `typecheck`, `lint`, `format`, `e2e`, `db:reset`, `check:env` y `check:harness`.
- **Alternativas.** pnpm o Turborepo (otra herramienta que instalar); dos repos (rompe la HU vertical).
- **Consecuencias.** Un solo `package-lock.json`; los comandos acotados usan `-w apps/<app>`.
- **Estado.** Aceptada (2026-11-16).

## DEC-03 · La base de datos `.db` no se versiona

- **Contexto.** Un fichero binario en git provoca conflictos en cada merge y arrastra datos de una etiqueta a otra.
- **Decisión.** Se versionan `apps/api/src/db/schema.sql`, las migraciones (`apps/api/src/db/migrations/NNN-descripcion.sql`)
  y el seed (`apps/api/src/db/seed.ts`). `npm run db:reset` regenera `data/gymapp.db` desde cero. `.gitignore` excluye
  `data/*.db`. Los e2e usan su propia base (`data/e2e.db`).
- **Alternativas.** Versionar la `.db` (conflictos binarios); crear el esquema desde el código en el arranque (oculta
  el historial de cambios del modelo).
- **Consecuencias.** Toda HU que cambie el modelo añade una migración nueva; nunca se edita una ya comiteada. El seed
  usa **solo datos inventados**.
- **Estado.** Aceptada (2026-11-16).

## DEC-04 · Sin login: un único rol, "socio", que elige su nombre

- **Contexto.** El curso enseña el flujo SDD, no autenticación; un login añade pantallas, secretos y casos límite que
  no aportan a la práctica.
- **Decisión.** No hay autenticación. Toda la aplicación la usa un único rol, **"socio"**, que elige su nombre en un
  selector. La API escucha solo en `127.0.0.1` y rechaza con `403 CROSS_SITE_REQUEST` las escrituras que llegan desde
  otro sitio (`Sec-Fetch-Site`), en `apps/api/src/http/cross-site.ts`.
- **Alternativas.** Login local con sesión (más superficie y más tiempo); un rol de personal del gimnasio (duplica
  casos de uso sin enseñar nada nuevo del flujo).
- **Consecuencias.** Los PRD no declaran permisos por rol; la categoría "seguridad" de los casos límite se centra en
  exposición de datos personales, inyección, enumeración, recursos de otro socio y abuso de tamaño. Si una feature
  necesitara roles, abriría un `DEC-NN` nuevo.
- **Estado.** Aceptada (2026-11-16).

## DEC-05 · Dependencias de desarrollo añadidas y TypeScript 6.0.x

- **Contexto.** El plan fija como dependencias `fastify`, `react`, `react-dom` y `vite`; en desarrollo, `typescript`,
  `vitest`, `@testing-library/react`, `jsdom`, `@playwright/test`, `eslint`, `typescript-eslint` y `prettier`, más los
  plugins imprescindibles. Cualquier otra se justifica aquí.
- **Decisión.** Se añaden, solo en desarrollo:
  - `@types/node`, `@types/react`, `@types/react-dom`: tipos de Node y React para el modo `strict`.
  - `@eslint/js` y `globals`: configuración base de ESLint *flat config* y globales de Node y navegador.
  - `@testing-library/dom`: dependencia *peer* obligatoria de `@testing-library/react` 16.
  - `eslint-plugin-react-hooks`: reglas de hooks de React (plugin imprescindible).
  - `@vitejs/plugin-react`: plugin de React para Vite (plugin imprescindible).

  Y se fija **TypeScript 6.0.3**: `typescript-eslint` 8.71 exige `typescript < 6.1`, así que la 7.x todavía no es
  compatible con el lint. Fuente: el `package.json` publicado de `typescript-eslint@8.71.1` declara
  `peerDependencies.typescript: ">=4.8.4 <6.1.0"` (`npm view typescript-eslint@8.71.1 peerDependencies`, consultado
  el 2026-10-06, cuando la última de TypeScript era la 7.0.2).
- **Alternativas.** TypeScript 7.x sin lint de tipos (perdemos `typescript-eslint`); ESLint sin plugin de hooks (deja
  pasar errores de React que la review tendría que cazar a mano).
- **Consecuencias.** Las versiones van fijadas (sin `^`) en los `package.json`. Subir TypeScript a 7.x queda pendiente
  de que `typescript-eslint` lo soporte; se hará con un `DEC-NN` nuevo.
- **Estado.** Aceptada (2026-11-16).

## DEC-06 · Errores con envelope único y validación estricta

- **Contexto.** La web tiene que distinguir los errores (un socio que no existe, un cupo agotado, un solape) sin
  analizar textos, y la API no debe filtrar datos personales en sus mensajes.
- **Decisión.** Todo error sale como `{ error: { code, message, details?, ...extra } }`: `code` estable en
  `SCREAMING_SNAKE_CASE` (`VALIDATION_ERROR`, `NOT_FOUND`, `MEMBER_NOT_FOUND`…), `message` en castellano para la
  persona, `details` (`[{ field, message }]`) en los errores de validación y campos numéricos extra cuando la web los
  necesita (p. ej., `remainingDays`). El servicio lanza `AppError` (`apps/api/src/errors.ts`) y solo
  `apps/api/src/http/error-handler.ts` construye la respuesta. JSON Schema estricto por ruta, sin coerción
  (`apps/api/src/http/validation.ts`). Códigos HTTP: 200/201 éxito, 400 validación, 404 inexistente, 409 conflicto.
- **Alternativas.** Mensajes sueltos sin código (la web no los puede distinguir); errores por ruta (cada uno con su
  forma).
- **Consecuencias.** Ningún mensaje repite el valor recibido ni lleva SQL o *stack traces*. El cliente web
  (`apps/web/src/components/http.ts`) entiende el envelope y separa los errores de red (`CLIENT_*`).
- **Estado.** Aceptada (2026-11-16).

## DEC-07 · Días de calendario de Europe/Madrid y reloj inyectado

- **Contexto.** La racha cuenta días, y "un día" a medianoche de UTC no es el día del socio en España. Además, las
  pruebas tienen que poder fijar "hoy".
- **Decisión.** Un día es un texto `AAAA-MM-DD` calculado en **Europe/Madrid** con `madridDay` de
  `apps/api/src/calendar.ts`; la aritmética de días (`addDays`) se hace sobre ese texto. La API recibe un **reloj
  inyectado** (`buildApp({ now })`, `Clock` de `apps/api/src/clock.ts`); ninguna regla lee `new Date()` suelto. La
  web no decide "hoy": lo recibe de la API y lo muestra como `dd/mm/aaaa`.
- **Alternativas.** Leer el reloj del sistema dentro de la lógica (obliga a trucos en las pruebas); usar UTC (rompe el
  día a medianoche en España); `vi.useFakeTimers()` (congela Fastify).
- **Consecuencias.** Las pruebas de frontera usan `createTestClock` (`apps/api/test/helpers/test-app.ts`) con
  instantes de invierno y de verano. Si un día hubiera gimnasios en otra zona, se abriría un `DEC-NN` nuevo.
- **Estado.** Aceptada (2026-11-16).

## DEC-08 · Módulos con capas y transacciones síncronas

- **Contexto.** El código tiene que ser fácil de leer y de revisar contra la spec, y las reglas de negocio (cupos,
  solapes) no pueden romperse con dos peticiones casi a la vez.
- **Decisión.** Cada módulo vive en `apps/api/src/modules/{código}/` con `routes.ts` (rutas y JSON Schema) →
  `service.ts` (reglas) → `repository.ts` (SQL con sentencias preparadas), y en `apps/web/src/features/{código}/` en
  la web. Hoy hay un único módulo, `asistencia` (código `attendance`). Ningún módulo importa a otro. Las operaciones de
  varias sentencias usan `withTransaction` (`apps/api/src/db/transaction.ts`) y leer, validar y escribir van **sin
  `await` en medio**: `node:sqlite` es síncrono y así ninguna otra petición se cuela entre medias.
- **Alternativas.** Un fichero por ruta con SQL dentro (difícil de probar); bloqueos explícitos (innecesarios con un
  único proceso síncrono).
- **Consecuencias.** Las reglas puras (cálculo de la racha, validación de una congelación) se prueban sin HTTP ni base
  de datos; las invariantes de unicidad se defienden además con `UNIQUE` en la base.
- **Estado.** Aceptada (2026-11-16).
