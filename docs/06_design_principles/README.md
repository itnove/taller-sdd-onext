# Principios de diseño de interfaz

Criterios que `frontend-architect` aplica al diseñar pantallas y que la review comprueba. Son pocos a propósito:
GymApp es la app del socio y cada pantalla tiene un dato principal.

## Principios

1. **Un dato principal por pantalla.** En la racha, el número de días, grande y legible. Un número de tres dígitos cabe.
2. **Todos los estados se diseñan, no solo el feliz.** Toda pantalla que carga datos contempla *cargando*, *vacío*,
   *error*, *con datos* y, si aplica, *sin conexión*.
3. **Accesible por defecto** (constitución, principio 4). Cada control con etiqueta visible (`<label>`), foco visible,
   orden de tabulación lógico, contraste AA y avisos con `role="status"` o `role="alert"`. Testing Library y
   Playwright seleccionan por rol y por nombre accesible: si un test no encuentra un elemento por su rol, la pantalla
   tiene un problema. Se lee bien con un 200 % de ampliación.
4. **Errores útiles junto a su campo**, con el `message` del envelope de la API y lo que hay que hacer para
   corregirlos; nunca un *stack trace* ni un código interno sin explicación.
5. **Datos personales con cuidado.** El selector de socios muestra solo el nombre. Ver [RGPD.md](../RGPD.md).
6. **Idioma y formato.** Textos en castellano de España, claros y sin jerga, con tuteo; fechas en `dd/mm/aaaa` para el
   socio e internamente días `AAAA-MM-DD`; texto de al menos 18 px.

## Estructura de la web

- Una carpeta por feature en `apps/web/src/features/{módulo}/` (hoy, `attendance`) con sus pantallas, su cliente de API
  y sus tipos; los tests, en `apps/web/test/`.
- Componentes reutilizables (mensajes de estado, cliente HTTP, formatos) en `apps/web/src/components/`.
- Formularios controlados con validación en el cliente para la experiencia y **siempre** validación en la API.
