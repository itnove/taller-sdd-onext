# Review: HU-01 Ver mi racha de asistencia

## 1. Resumen ejecutivo
- **Fecha:** 2026-11-17 · **Rama:** `hu/HU-01-racha` · **Commits revisados:** `8599d57..2d753b2` (9)
- **Ficheros tocados:** 38 (código: 9 de producción, 8 de test y 1 e2e; el resto, el rastro de la HU) · **Tasks:** 6/6
  completadas
- **Auditores:** security-auditor ✔ · datos-personales-auditor ✔ · doc-code-drift-checker ✔
- **Hallazgos:** críticos 0 · altos 0 · medios 1 · bajos 1
- La HU entrega la racha de asistencia en la API (`GET /api/members/:id/streak`) y en la web (panel con sus estados y
  sin conexión). Cumple el PRD: los 6 criterios y los 12 edge cases tienen test en verde.

## 2. Veredicto
Aprobado con observaciones: todo criterio tiene su test en verde y la integración pasa; queda una observación que
esconde una decisión de producto (O-1) y no bloquea.

## 3. Decisiones aplicables

| DEC-NN | Aplica porque | ¿Cumple? |
|---|---|---|
| DEC-04 | Sin login: la racha se pide por `:id` | Sí: `apps/api/src/modules/attendance/routes.ts:27` |
| DEC-06 | 404 `MEMBER_NOT_FOUND` y schema de respuesta | Sí: `apps/api/src/modules/attendance/schemas.ts:27`, `service.ts:27` |
| DEC-07 | "Hoy" de Madrid con el reloj inyectado | Sí: `apps/api/src/modules/attendance/service.ts:41` |
| DEC-08 | Regla pura y capas | Sí: `apps/api/src/modules/attendance/streak.ts:11` |

## 4. Hallazgos por auditor

### security-auditor
- **Bajo (B4, aceptado por DEC-04).** `GET /api/members/:id/streak` devuelve la racha de cualquier `id` sin
  comprobar quién la pide. Es la consecuencia de DEC-04 (sin login) y solo expone un número, sin nombre. Sin acción.
- Inyección: `:id` validado con `pattern` y SQL parametrizado (`repository.ts:27`); probado en
  `apps/api/test/attendance/streak-adversarial.test.ts:48`.

### datos-personales-auditor
- P7: la respuesta tiene 4 campos y `additionalProperties: false` (`schemas.ts:27`); probado en
  `streak-api.test.ts:52`.
- P9: `localStorage` guarda solo `today`, `days` y `congratulate` (`streak-cache.ts:28`), lo que permite RGPD §6;
  probado en `streak-cache.test.ts:14`.
- Sin hallazgos.

### doc-code-drift-checker
- Las rutas de los dos TECHNICAL_DOC existen. `docs/05_modules/asistencia/` aún describe el módulo sin racha: se
  actualiza en `/module-sync`. No bloquea.

## 5. Criterio → test

| Origen | UC | Criterio o edge case | Categoría | Test (`fichero:línea`) | Estado |
|---|---|---|---|---|---|
| CA-01 / RF-01 (Must) | UC-01 · P | La racha es un entero ≥ 0 | - | `apps/api/test/attendance/streak.test.ts:11`, `streak-adversarial.test.ts:70` | pasa |
| CA-02 / RF-01 (Must) | UC-01 · P | 4 días + check-in hoy → 5 | - | `apps/api/test/attendance/streak.test.ts:18`, `streak-api.test.ts:33`, `apps/web/test/features/attendance/StreakPanel.test.tsx:63` | pasa |
| CA-03 / RF-01, RF-03 (Must) | UC-01 · A1 | Faltó ayer → 0 y "Empieza tu racha hoy" | - | `apps/api/test/attendance/streak.test.ts:22`, `apps/web/test/features/attendance/streak-view.test.ts:11`, `StreakPanel.test.tsx:37`, `e2e/streak.spec.ts:29` | pasa |
| CA-04 / RF-02, RF-03 (Must) | UC-01 · A2 | 6 + check-in → 7 y felicitación | - | `apps/api/test/attendance/streak-api.test.ts:43`, `apps/web/test/features/attendance/StreakPanel.test.tsx:45`, `e2e/streak.spec.ts:6` | pasa |
| CA-05 / RF-04 (Should) | UC-01 · E1 | Sin conexión → última racha con aviso | - | `apps/web/test/features/attendance/StreakPanel.test.tsx:82` | pasa |
| CA-06 / RNF-01 | - | Menos de 300 ms con 400 check-ins | - | `apps/api/test/attendance/streak-api.test.ts:80` | pasa |
| EC-01 | UC-01 · P | Hoy sin check-in, ayer sí | boundary | `apps/api/test/attendance/streak.test.ts:26` | pasa |
| EC-02 | UC-01 · P | 23:59:59 y 00:00:00 de Madrid, invierno y verano | boundary | `apps/api/test/attendance/streak-adversarial.test.ts:29`, `:40` | pasa |
| EC-03 | UC-01 · P | Duplicados antiguos cuentan uno | datos corruptos | `apps/api/test/attendance/streak.test.ts:30`, `streak-adversarial.test.ts:70` | pasa |
| EC-04 | - | Socio inexistente → 404 | input inválido | `apps/api/test/attendance/streak-api.test.ts:60` | pasa |
| EC-05 | - | Consultar dos veces no cambia nada | idempotencia | `apps/api/test/attendance/streak-api.test.ts:69` | pasa |
| EC-06 | UC-01 · P | 120 cabe | boundary | `apps/web/test/features/attendance/streak-view.test.ts:30`, `e2e/streak.spec.ts:22` | pasa |
| EC-07 | UC-01 · A2 | 6 sin felicitación, 7 con ella | boundary | `apps/web/test/features/attendance/streak-view.test.ts:25`, `apps/api/test/attendance/streak-api.test.ts:43` | pasa |
| EC-08 | UC-01 · E1 | Sin conexión y nada guardado → solo aviso | fallo de dependencia | `apps/web/test/features/attendance/StreakPanel.test.tsx:93` | pasa |
| EC-09 | - | Dos check-ins casi a la vez → uno | concurrencia | `apps/api/test/attendance/checkins.test.ts:33` | pasa |
| EC-10 | - | `:id` hostil → 400 | seguridad | `apps/api/test/attendance/streak-adversarial.test.ts:48` | pasa |
| EC-11 | - | Fallo de lectura → 500 sin datos | fallo de dependencia | `apps/api/test/attendance/streak-adversarial.test.ts:57` | pasa |
| EC-12 | - | Forma inesperada → error con reintento | input inválido | `apps/web/test/features/attendance/StreakPanel.test.tsx:53` | pasa |

## 6. Gates de QUALITY-GATES

| Umbral | Medido | ¿Cumple? |
|---|---|---|
| Líneas por fichero ≤ 300 | Máximo 157 (`apps/web/src/components/http.ts`, transversal); de la HU, 70 (`AttendanceScreen.tsx`) | Sí |
| Líneas por función ≤ 50 | Lo mide `npm run lint` (`max-lines-per-function`): 0 avisos | Sí |
| 1 test por RF y por edge case Must | 4/4 RF, 6/6 CA, 12/12 EC | Sí |
| Anti-patrones de §4 | Ninguna aserción síncrona de efectos pasivos (`check:harness`); sin datos reales | Sí |

## 7. Integración
Comandos ejecutados **por la review** y su salida real:

```
$ npm test -w apps/api
 Test Files  10 passed (10)
      Tests  39 passed (39)

$ npm test -w apps/web
 Test Files  6 passed (6)
      Tests  27 passed (27)

$ npm run typecheck
(exit 0)

$ npm run lint
(exit 0, sin salida)

$ npx playwright test
    4 passed (4.4s)
```

## 8. Limitaciones
Ninguna.

## 9. Acciones requeridas
Ninguna bloqueante. Observaciones:

1. **O-1 (medio, decisión de producto).** Sin conexión, el panel muestra la última racha guardada pero no **de qué
   día** es, aunque se guarda (`today`). Si el socio abre la app dos días después sin conexión, ve una racha que quizá
   ya no es la suya. **Esconde una decisión de producto:** se pregunta a Nuria; no se decide en el código.
   - 2026-11-17 · **Nuria:** "Que se quede así en esta versión; lo vemos con el check-in sin conexión." Queda en
     "Alcance no implementado" del módulo.
2. **O-2 (bajo).** La racha de un `id` la puede pedir cualquiera (DEC-04). Aceptado.

**Aprobación del cambio (firma 4):** Nuria (PO), 2026-11-17, tras recorrer la tabla criterio → test y la web con el
seed (Tomás vacío, Lucía 5, Irene 7 tras su check-in, Pau 120 y sin conexión parando la API).

---
Ronda: 1 · "Requiere cambios" previos: 0 (máximo 2; al tercero se para y se escala a la persona)

VERDICT: Aprobado con observaciones
