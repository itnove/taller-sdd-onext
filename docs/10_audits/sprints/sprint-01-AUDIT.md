# Auditoría del sprint-01

## Resumen
- **Fecha:** 2026-11-17 · **HU auditadas:** HU-01 (y las tareas sin HU T-01 y T-02)
- **Rango auditado:** `e1825af..d17a5b0` (`base` del frontmatter del sprint → `main`) · **Commit auditado:** `d17a5b0`
- **Commits:** 16 · **Ficheros tocados:** 61
- **Hallazgos:** críticos 0 · altos 0 · medios 0 · bajos 2

## 1. Suite completa

| Comando | Resultado | Detalle |
|---|---|---|
| `npm run typecheck` | verde | api, web y raíz |
| `npm run lint` | verde | incluido `max-lines-per-function` (50) |
| `npm test` | verde | API: 39 tests en 10 ficheros · web: 27 tests en 6 ficheros |
| `npm run e2e` | verde | 4 tests en 2 specs |

Ejecutada con `npm run integrate` (en serie, logs en `logs/integrate/`):

```
Paso           Resultado   Segundos
-----------------------------------
typecheck      verde            4,5
lint           verde            2,1
test-api       verde            2,2
test-web       verde            2,8
e2e            verde            5,2
check-harness  verde            2,0
-----------------------------------
Total                          18,8
```

Ningún fallo.

## 2. Dimensión código
- **Interacciones:** T-02 y HU-01 comparten `AttendanceScreen`; el check-in refresca la racha por `refreshKey`
  (`apps/web/src/features/attendance/AttendanceScreen.tsx`), probado en
  `apps/web/test/features/attendance/StreakPanel.test.tsx:63`. Sin duplicación entre API y web: la felicitación solo
  la decide la API (DD-02).
- **Umbrales:** fichero más largo 157 líneas (`apps/web/src/components/http.ts`); funciones ≤ 50 líneas (lint).
- **Drift doc-código:** `docs/05_modules/asistencia/`, `docs/MVP-STATUS.md` y el catálogo de UC al día tras
  `/module-sync` (`check:harness` en verde).
- **Bajo (A-01).** `e2e/streak.spec.ts` depende del día del reset: si la ejecución cruza la medianoche de Madrid
  entre el reset y el check-in de Irene, la racha no pasa de 6 a 7. Improbable (la suite tarda segundos). Acción:
  ninguna; se anota en `technical.md` si llega a pasar.

## 3. Dimensión seguridad y datos personales
- **security-auditor:** sin hallazgos nuevos sobre el agregado. La racha por `:id` sin login es DEC-04 (bajo,
  aceptado en la review de HU-01, O-2).
- **datos-personales-auditor:** el inventario de RGPD §1 cubre `members` y `check_ins`; el navegador guarda solo la
  última racha (§6). Ningún dato de salud ni campo de texto libre. **Bajo (A-02):** la retención "mientras sea socio"
  depende de una baja que hoy gestiona el gimnasio fuera de la app (RGPD §4); queda documentado, sin acción en este
  sprint.

## 4. Dimensiones no concluidas
Ninguna.

## 5. Override
No aplica.

## 6. Acciones
- [x] Ninguna bloqueante. A-01 y A-02 quedan anotadas.

VERDICT: Aprobado con observaciones
