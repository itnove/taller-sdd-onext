# TASK-04 · Sin conexión: última racha guardada

## Metadata
- **HU:** HU-01 · **Feature:** FEAT-01
- **Scope:** frontend
- **Capa:** web: builder `web-builder`
- **Estado:** Pendiente
- **Complejidad:** S (< 1 h)

## Descripción
`streak-cache.ts` guarda `{ today, days, congratulate }` por socio tras cada carga correcta y el panel la pinta con el aviso si la API no responde; sin nada guardado, solo el aviso.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/web/src/features/attendance/streak-cache.ts` | crear |
| `apps/web/src/features/attendance/StreakPanel.tsx` | modificar |
| `apps/web/test/features/attendance/streak-cache.test.ts` | crear |
| `apps/web/test/features/attendance/StreakPanel.test.tsx` | modificar |

## Implementa
- RF-04 · CA-05 · EC-08
- Diseño: `plans/TECHNICAL_DOC-frontend.md` § "Pantallas y estados", "DD-04", "Datos personales"

## Dependencias
- **Depende de:** TASK-03
- **Bloquea:** TASK-06

## Criterios de done
- [ ] CA-05: sin conexión, la última racha guardada con "Sin conexión: esta es tu última racha guardada.".
- [ ] EC-08: sin nada guardado, solo el aviso, sin número.
- [ ] En `localStorage` solo `today`, `days` y `congratulate` (RGPD §6); un valor manipulado se ignora.
- [ ] Si `localStorage` falla, la racha se sigue mostrando.
- [ ] `npm test -w apps/web -- attendance` en verde, con 4 fichero(s) de test.
- [ ] `npm run typecheck` sin errores.
- [ ] `npx eslint <ficheros tocados>` sin errores.
- [ ] Commit único `feat(web): show the last saved streak when offline [HU-01 TASK-04]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
