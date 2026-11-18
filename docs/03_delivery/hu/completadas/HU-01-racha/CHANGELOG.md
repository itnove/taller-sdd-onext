# Changelog: HU-01 Ver mi racha de asistencia

> Escrito al aprobar la HU (review del 2026-11-17). Una entrada por task entregada, en lenguaje funcional.

## Entradas

### 2026-11-17 · TASK-01: la racha se calcula en días de Madrid
- **Tipo:** feature
- **Qué se entregó:** GymApp cuenta los días seguidos que el socio ha venido; si hoy aún no ha venido pero ayer sí, la
  racha sigue viva, y dos check-ins el mismo día cuentan uno.
- **Archivos afectados:**
  - `apps/api/src/modules/attendance/streak.ts`: cálculo de la racha
- **Commit:** `3071778`
- **Desviaciones del PRD:** Ninguna

### 2026-11-17 · TASK-02: la API da la racha y si toca felicitar
- **Tipo:** feature
- **Qué se entregó:** la app puede pedir la racha de un socio; a partir de 7 días viene marcada para felicitarle. Tarda
  menos de 300 ms incluso con 400 check-ins.
- **Archivos afectados:**
  - `apps/api/src/modules/attendance/{repository,service,schemas,routes}.ts`: `GET /api/members/:id/streak`
- **Commit:** `ea5fab2`
- **Desviaciones del PRD:** Ninguna

### 2026-11-17 · TASK-03: el socio ve su racha
- **Tipo:** feature
- **Qué se entregó:** al elegir su nombre, el socio ve su racha en grande; con 0 días, "Empieza tu racha hoy"; con 7
  o más, la felicitación. Tras el check-in, la racha se actualiza sola.
- **Archivos afectados:**
  - `apps/web/src/features/attendance/{streak-view.ts,StreakPanel.tsx,AttendanceScreen.tsx,api.ts,types.ts}`
- **Commit:** `548c2ec`
- **Desviaciones del PRD:** Ninguna

### 2026-11-17 · TASK-04: sin conexión, la última racha
- **Tipo:** feature
- **Qué se entregó:** si no hay conexión, el socio ve la última racha que vio con el aviso "Sin conexión"; si nunca
  la vio, solo el aviso.
- **Archivos afectados:**
  - `apps/web/src/features/attendance/streak-cache.ts`: la última racha en el navegador (RGPD §6)
- **Commit:** `4a115e8`
- **Desviaciones del PRD:** Ninguna

### 2026-11-17 · TASK-05 y TASK-06: probada a propósito
- **Tipo:** test
- **Qué se entregó:** pruebas que intentan romper la racha (medianoche de Madrid en invierno y en verano, identificadores
  hostiles, fallos de la base) y el recorrido completo en el navegador.
- **Archivos afectados:**
  - `apps/api/test/attendance/streak-adversarial.test.ts`, `e2e/streak.spec.ts`
- **Commit:** `d618b95`, `2d753b2`
- **Desviaciones del PRD:** Ninguna
