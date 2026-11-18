# Review: HU-02 Congelar mi racha

## 1. Resumen ejecutivo
- **Fecha:** 2026-11-18 · **Rama:** `hu/HU-02-congelar-racha` · **Commits revisados:** `4e4066b..033c6b8` (13)
- **Ficheros tocados:** código de 7 tasks (API, web y e2e) y el rastro de la HU · **Tasks:** 7/7 completadas
- **Auditores:** security-auditor ✔ · datos-personales-auditor ✔ · doc-code-drift-checker ✔
- **Hallazgos:** críticos 0 · altos 0 · medios 0 · bajos 2
- La HU entrega congelar la racha con su cupo anual, la racha que se salta los días congelados, la cancelación y la
  pantalla, sin pedir nunca el motivo. Cumple el PRD.

## 2. Veredicto
Aprobado con observaciones: tras la corrección de la ronda 1, los 10 criterios y los 16 edge cases tienen test en verde; queda una observación que es una decisión de producto (O-1).

## 3. Decisiones aplicables

| DEC-NN | Aplica porque | ¿Cumple? |
|---|---|---|
| DEC-04 | Sin login: todo va por el `:id` del socio | Sí: `apps/api/src/modules/attendance/repository.ts` (`findFreeze` por socio e id) |
| DEC-06 | 400 con `details`, 409 con `remainingDays`, schema estricto | Sí: `apps/api/src/modules/attendance/freeze-service.ts` (`toAppError`), `schemas.ts` (`freezeBodySchema`) |
| DEC-07 | "Hoy" de Madrid con el reloj inyectado | Sí: `freeze-service.ts` (`madridDay(now())`) |
| DEC-08 | Reglas puras y transacción sin `await` | Sí: `freeze-rules.ts`; `freeze-service.ts` (`transaction(() => …)`) |

## 4. Hallazgos por auditor

### security-auditor
Sin hallazgos (como en la ronda 1).

### datos-personales-auditor
Sin hallazgos. Ningún dato de salud: ni columna, ni campo, ni texto libre (EC-14).

### doc-code-drift-checker
- `docs/05_modules/asistencia/` aún no menciona la congelación: se actualiza con `/module-sync`. No bloquea.
- **Bajo.** `tasks/TASK-05.md` preveía 6 ficheros de test de `attendance` y son 5 (dos ya existían): anotado en su
  brief. Sin acción.

## 5. Criterio → test

| Origen | UC | Criterio o edge case | Categoría | Test (`fichero:línea`) | Estado |
|---|---|---|---|---|---|
| CA-01 / RF-01 (Must) | UC-02 · E1 | Fechas no válidas, hacia atrás o fin antes del inicio: error del campo, nada guardado | - | `apps/api/test/attendance/freeze-rules.test.ts:28`, `:36`, `:44`, `apps/api/test/attendance/freeze-api.test.ts:61`, `apps/web/test/features/attendance/FreezeSection.test.tsx:77`, `e2e/freeze.spec.ts:56` | pasa |
| CA-02 / RF-01 (Must) | UC-02 · E2, A1 | Sin cupo: rechazo con los días que quedan; cruza de año | - | `apps/api/test/attendance/freeze-rules.test.ts:50`, `:59`, `:68`, `:98`, `apps/api/test/attendance/freeze-api.test.ts:94`, `apps/web/test/features/attendance/FreezeSection.test.tsx:103` | pasa |
| CA-03 / RF-01 (Must) | UC-02 · E3 | Solape: rechazo | - | `apps/api/test/attendance/freeze-rules.test.ts:79`, `apps/api/test/attendance/freeze-api.test.ts:110` | pasa |
| CA-04 / RF-01 (Must) | UC-02 · P | Rango válido: se guarda y devuelve lo que queda | - | `apps/api/test/attendance/freeze-api.test.ts:27`, `:43`, `apps/web/test/features/attendance/FreezeSection.test.tsx:52`, `e2e/freeze.spec.ts:23` | pasa |
| CA-05 / RF-02 (Must) | UC-01 · A3 | Día congelado sin check-in: ni suma ni rompe | - | `apps/api/test/attendance/streak-freeze.test.ts:13`, `:75` | pasa |
| CA-06 / RF-02 (Must) | UC-01 · A4 | Venir un día congelado suma | - | `apps/api/test/attendance/streak-freeze.test.ts:22` | pasa |
| CA-07 / RF-03 (Should) | UC-03 · P | Cancelar antes de empezar devuelve los días | - | `apps/api/test/attendance/freeze-cancel.test.ts:31`, `:52`, `apps/web/test/features/attendance/FreezeSection.test.tsx:160`, `e2e/freeze.spec.ts:40` | pasa |
| CA-08 / RF-03 (Should) | UC-03 · E1 | Ya empezada: no se cancela | - | `apps/api/test/attendance/freeze-cancel.test.ts:59`, `:74` | pasa |
| CA-09 / RF-04 (Must) | UC-01 · A5 | Hoy congelado: "Racha congelada hasta el dd/mm/aaaa" | - | `apps/web/test/features/attendance/streak-view.test.ts:55`, `apps/web/test/features/attendance/StreakPanel.test.tsx:118`, `e2e/freeze.spec.ts:23` | pasa |
| CA-10 / RF-02 (Must) | - | Sin congelaciones, igual que la v1 | - | `apps/api/test/attendance/streak-freeze.test.ts:34` y los tests de HU-01 (`apps/api/test/attendance/streak.test.ts`, `streak-api.test.ts`, `streak-adversarial.test.ts`) | pasa |
| EC-01 | UC-02 · E1 | Día que no existe, otro formato, vacío o ausente | input inválido | `apps/api/test/attendance/freeze-rules.test.ts:28`, `apps/api/test/attendance/freeze-api.test.ts:80` | pasa |
| EC-02 | UC-02 · E1 | Inicio hoy · inicio ayer | boundary | `apps/api/test/attendance/freeze-rules.test.ts:36`, `apps/api/test/attendance/freeze-api.test.ts:61` | pasa |
| EC-03 | UC-02 · E2 | 7 días vale · 8 no | boundary | `apps/api/test/attendance/freeze-rules.test.ts:50`, `apps/api/test/attendance/freeze-api.test.ts:94` | pasa |
| EC-04 | UC-02 · A1 | Del 30/12 al 02/01 | boundary | `apps/api/test/attendance/freeze-rules.test.ts:68` | pasa |
| EC-05 | UC-02 · E3 | Dos solapadas a la vez: entra una | concurrencia | `apps/api/test/attendance/freeze-adversarial.test.ts:26` | pasa |
| EC-06 | - | Fallo al guardar: 500 y nada a medias | fallo de dependencia | `apps/api/test/attendance/freeze-adversarial.test.ts:36` | pasa |
| EC-07 | UC-01 · A5 | Empieza mañana: hoy no está congelado | boundary | `apps/api/test/attendance/streak-freeze.test.ts:82` | pasa |
| EC-08 | UC-01 · A3 | Un hueco sin congelar rompe | boundary | `apps/api/test/attendance/streak-freeze.test.ts:28` | pasa |
| EC-09 | - | Socio sin congelaciones: igual que la v1 | datos corruptos | `apps/api/test/attendance/streak-freeze.test.ts:34` | pasa |
| EC-10 | UC-01 · A3 | Cancelada: no se salta | datos corruptos | `apps/api/test/attendance/streak-freeze.test.ts:89` | pasa |
| EC-11 | - | Cancelar dos veces | idempotencia | `apps/api/test/attendance/freeze-cancel.test.ts:83` | pasa |
| EC-12 | - | De otro socio o inexistente: 404 | seguridad | `apps/api/test/attendance/freeze-cancel.test.ts:98` | pasa |
| EC-13 | - | Sin conexión al congelar: aviso y se conserva lo escrito | fallo de dependencia | `apps/web/test/features/attendance/FreezeSection.test.tsx:127` | pasa |
| EC-14 | - | Un campo de motivo: 400 y nada guardado | seguridad | `apps/api/test/attendance/freeze-adversarial.test.ts:48`, `apps/web/test/features/attendance/FreezeSection.test.tsx:187` | pasa |
| EC-15 | - | Cuerpo que no es JSON, vacío o un array: 400 | input inválido | `apps/api/test/attendance/freeze-adversarial.test.ts:61`, `:71` | pasa |
| EC-16 | - | Doble clic en "Congelar" | idempotencia | `apps/web/test/features/attendance/FreezeSection.test.tsx:141`, `apps/api/test/attendance/freeze-api.test.ts:110` | pasa |
| RNF-01 | - | < 300 ms con 400 check-ins y 20 congelaciones | rendimiento | `apps/api/test/attendance/streak-freeze.test.ts:96`, `apps/api/test/attendance/freeze-adversarial.test.ts:99` | pasa |
| RNF-02 | - | Medianoche de Madrid al decidir "hoy" | boundary | `apps/api/test/attendance/freeze-adversarial.test.ts:89` | pasa |

## 6. Gates de QUALITY-GATES

| Umbral | Medido | ¿Cumple? |
|---|---|---|
| Líneas por fichero ≤ 300 | Máximo de la HU: `apps/web/test/features/attendance/FreezeSection.test.tsx`; en producción, `freeze-rules.ts` (≈ 130) | Sí |
| Líneas por función ≤ 50 | `npm run lint` (`max-lines-per-function`): 0 avisos | Sí |
| 1 test por RF y por edge case Must | 4/4 RF, 10/10 CA, 16/16 EC | Sí |
| Ciclos de arreglo por task ≤ 2 | Máximo 1 (TASK-01, TASK-04, TASK-05) | Sí |
| Anti-patrones de §4 | Ninguno | Sí |

## 7. Integración
Comandos ejecutados **por la review** y su salida real:

```
$ npm run integrate
Paso           Resultado   Segundos
-----------------------------------
typecheck      verde            5,4
lint           verde            2,9
test-api       verde            3,7
test-web       verde            4,7
e2e            verde            8,8
check-harness  verde            2,2
-----------------------------------
Total                          27,6

$ npm test -w apps/api
 Test Files  15 passed (15)
      Tests  86 passed (86)

$ npm test -w apps/web
 Test Files  7 passed (7)
      Tests  37 passed (37)

$ npx playwright test
  7 passed (8.0s)
```

## 8. Limitaciones
Ninguna.

## 9. Acciones requeridas
Ninguna bloqueante. La de la ronda 1 está resuelta: `apps/api/test/attendance/freeze-adversarial.test.ts:71` envía
un cuerpo que no es JSON (`application/json`) y uno de texto plano y comprueba el 400.

Observaciones:

1. **O-1 (bajo, decisión de producto).** "Te quedan N días para congelar este año" usa el año de hoy (DT-01 del PRD).
   Quien congela en diciembre días de enero ve el cupo de diciembre. Cumple el PRD, pero **esconde una decisión de
   producto**: se pregunta a Nuria.
   - 2026-11-18 · **Nuria:** "Se queda así en esta versión; lo apunto para la siguiente." Queda en "Alcance no
     implementado" del módulo.
2. **O-2 (bajo).** La desviación de TASK-05 (5 ficheros de test en vez de 6) está explicada en su brief.

**Aprobación del cambio (firma 4):** Nuria (PO), 2026-11-18, tras recorrer la tabla criterio → test y la web: congelar
desde hoy, el error al empezar ayer, el cupo que baja y sube al cancelar, el aviso de congelada y el aviso sin conexión
parando la API.

---
Ronda: 2 · "Requiere cambios" previos: 1 (máximo 2; al tercero se para y se escala a la persona)

VERDICT: Aprobado con observaciones
