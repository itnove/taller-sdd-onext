# Changelog: HU-02 Congelar mi racha

> Escrito al aprobar la HU (review del 2026-11-18, ronda 2). Una entrada por task entregada, en lenguaje funcional.

## Entradas

### 2026-11-18 · TASK-01: las reglas de la congelación
- **Tipo:** feature
- **Qué se entregó:** las reglas de congelar: desde hoy, hasta 7 días por año (cada día en su año), sin solapes, y
  cancelar solo antes de empezar.
- **Archivos afectados:**
  - `apps/api/src/modules/attendance/freeze-rules.ts`
- **Commit:** `1998421`
- **Desviaciones del PRD:** Ninguna

### 2026-11-18 · TASK-02: congelar y ver mis congelaciones
- **Tipo:** feature
- **Qué se entregó:** el socio puede congelar un rango de días y ver sus congelaciones y los días que le quedan este
  año. Si se pasa del cupo, se le dice cuántos le quedan. Nunca se le pide el motivo.
- **Archivos afectados:**
  - `apps/api/src/db/migrations/002-create-freezes.sql`, `apps/api/src/modules/attendance/{freeze-service,freeze-routes}.ts`
- **Commit:** `74325fb`
- **Desviaciones del PRD:** Ninguna

### 2026-11-18 · TASK-03: la racha no se pierde mientras está congelada
- **Tipo:** feature
- **Qué se entregó:** los días congelados sin venir ni suman ni rompen la racha; venir un día congelado suma. La app
  sabe hasta cuándo está congelada hoy.
- **Archivos afectados:**
  - `apps/api/src/modules/attendance/{streak,service}.ts`
- **Commit:** `0c8561b`
- **Desviaciones del PRD:** Ninguna

### 2026-11-18 · TASK-04: cancelar una congelación
- **Tipo:** feature
- **Qué se entregó:** el socio puede cancelar una congelación que aún no ha empezado y recupera sus días.
- **Archivos afectados:**
  - `apps/api/src/modules/attendance/{freeze-service,freeze-routes,repository}.ts`
- **Commit:** `39ff860`
- **Desviaciones del PRD:** Ninguna

### 2026-11-18 · TASK-05: congelar desde la app
- **Tipo:** feature
- **Qué se entregó:** en "Tu asistencia", la sección "Congelar mi racha" con "Desde" y "Hasta", los errores junto a su
  campo, los días que quedan, la lista con "Cancelar" y, en la racha, "Racha congelada hasta el dd/mm/aaaa".
- **Archivos afectados:**
  - `apps/web/src/features/attendance/{FreezeSection,FreezeForm,FreezeList,freeze-api,streak-view,StreakPanel}`
- **Commit:** `4a9aac6`
- **Desviaciones del PRD:** Ninguna

### 2026-11-18 · TASK-06 y TASK-07: probada a propósito
- **Tipo:** test
- **Qué se entregó:** pruebas que intentan romper la congelación (dos a la vez, un fallo al guardar, un motivo
  colado, cuerpos hostiles, la medianoche de Madrid) y el recorrido completo en el navegador. La review pidió que el test
  del cuerpo que no es JSON lo enviara de verdad.
- **Archivos afectados:**
  - `apps/api/test/attendance/freeze-adversarial.test.ts`, `e2e/freeze.spec.ts`
- **Commit:** `3e633f3`, `033c6b8` (corrección de la review), `db493c1`
- **Desviaciones del PRD:** Ninguna
