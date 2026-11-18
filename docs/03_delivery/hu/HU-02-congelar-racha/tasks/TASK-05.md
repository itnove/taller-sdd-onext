# TASK-05 · Pantalla: congelar, cancelar y aviso de congelada

## Metadata
- **HU:** HU-02 · **Feature:** FEAT-02
- **Scope:** frontend
- **Capa:** web: builder `web-builder`
- **Estado:** Pendiente
- **Complejidad:** L (2–4 h)

## Descripción
`freeze-api.ts`, `FreezeSection`, `FreezeForm` y `FreezeList`, compuestos en `AttendanceScreen`; el aviso "Racha congelada hasta el dd/mm/aaaa" en el panel.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `apps/web/src/features/attendance/freeze-api.ts` | crear |
| `apps/web/src/features/attendance/FreezeSection.tsx` | crear |
| `apps/web/src/features/attendance/FreezeForm.tsx` | crear |
| `apps/web/src/features/attendance/FreezeList.tsx` | crear |
| `apps/web/src/features/attendance/types.ts` | modificar |
| `apps/web/src/features/attendance/api.ts` | modificar |
| `apps/web/src/features/attendance/streak-view.ts` | modificar |
| `apps/web/src/features/attendance/StreakPanel.tsx` | modificar |
| `apps/web/src/features/attendance/AttendanceScreen.tsx` | modificar |
| `apps/web/test/features/attendance/FreezeSection.test.tsx` | crear |
| `apps/web/test/features/attendance/streak-view.test.ts` | modificar |
| `apps/web/test/features/attendance/StreakPanel.test.tsx` | modificar |

## Implementa
- RF-04 · CA-09 · EC-13, EC-16 · RNF-03, RNF-04
- Diseño: `plans/TECHNICAL_DOC-frontend.md` § "Pantallas y estados", "DD-05", "DD-06"

## Dependencias
- **Depende de:** TASK-02, TASK-03, TASK-04
- **Bloquea:** TASK-07

## Criterios de done
- [ ] CA-09: con `frozenUntil`, "Racha congelada hasta el dd/mm/aaaa" en el panel.
- [ ] Congelar: la lista y el cupo se actualizan y la racha se recarga.
- [ ] 400: el error bajo "Desde" o "Hasta", con `role="alert"`, sin perder lo escrito.
- [ ] 409: el mensaje de la API bajo el formulario.
- [ ] EC-13: sin conexión, aviso y lo escrito se conserva.
- [ ] EC-16: "Congelar" deshabilitado mientras se envía.
- [ ] "Cancelar" solo en las que empiezan después de hoy.
- [ ] Sin campo de motivo (RNF-04).
- [ ] `npm test -w apps/web -- attendance` en verde, con 6 fichero(s) de test.
- [ ] `npm run typecheck` sin errores.
- [ ] `npx eslint <ficheros tocados>` sin errores.
- [ ] Commit único `feat(web): freeze form, list and frozen notice [HU-02 TASK-05]` nombrando los ficheros.

## Notas de implementación
- Ninguna.
