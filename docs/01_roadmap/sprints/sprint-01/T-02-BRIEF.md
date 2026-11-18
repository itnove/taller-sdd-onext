# Brief de implementación: sprint-01 · T-02 · Elegir socio y hacer check-in en la web

> Tarea de sprint sin HU (WORKFLOW §9). Mismo formato que `docs/_templates/BRIEF-IMPLEMENTACION.template.md`.

## 1. Qué hay que hacer
- **Capa y builder:** `web` → `web-builder`.
- **Qué:** pantalla `AttendanceScreen` en `apps/web/src/features/attendance/` con el selector "Socio" (cargado de
  `GET /api/members`, con estados cargando y error con reintento) y el botón "Hacer check-in hoy", que llama a
  `POST /api/members/:id/checkins` y anuncia con `role="status"` "Check-in registrado." o "Hoy ya tenías check-in.";
  sin conexión, "Sin conexión: el check-in no se ha podido registrar.". `App.tsx` la compone. El smoke de Playwright
  comprueba el título y el selector con los socios del seed.

## 2. Invariantes que aplican
- [x] **Accesibilidad:** `label` visible, botón deshabilitado mientras se envía, avisos con `role="status"`.
- [x] **Reuso obligatorio:** `requestJson`, `userMessage` e `isOffline` (`apps/web/src/components/http.ts`);
      `LoadingMessage` y `ErrorMessage` (`apps/web/src/components/StatusMessages.tsx`); `mockFetch` en los tests.
- [x] Nada en `localStorage` en esta tarea.

## 3. Prohibiciones
- [x] Sin commit, sin librerías nuevas, sin tocar `apps/api`.

## 4. Verificación
- [x] `npm test -w apps/web`, `npm run typecheck`, `npx eslint apps/web e2e`, `npx playwright test e2e/smoke.spec.ts`.

## 7. Resultado de la integración

```
npm test -w apps/web                   → Test Files 3 passed (3) · Tests 9 passed (9)
npm run typecheck                      → sin errores
npx eslint apps/web e2e                → sin errores
npx playwright test e2e/smoke.spec.ts  → 1 passed
```

- **Resultado:** verde en el ciclo 1/2: el lint marcó un `setState` síncrono dentro del efecto de carga (`react-hooks/set-state-in-effect`); el estado "cargando" pasa al reintento.
- **APRENDIZAJE:** con `eslint-plugin-react-hooks` 7, el estado previo a una carga se pone en el manejador que la dispara, no al principio del efecto.
