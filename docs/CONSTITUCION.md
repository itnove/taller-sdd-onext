# Constitución de GymApp

Principios innegociables. Toda feature, todo PRD, todo diseño técnico y toda tarea deben cumplirlos. Si un documento
choca con uno de ellos, se para y se pregunta a la persona. Los agentes la leen en cada paso de la cadena.

1. **La spec manda, cero asunciones.** No se construye nada que no esté en la spec aprobada. Si falta una decisión, se
   para el trabajo y se pregunta a producto.
2. **Toda feature mide algo.** Cada feature declara su métrica de éxito antes de construirse.
3. **Datos mínimos.** Nunca pedimos ni guardamos datos de salud ni de pago en la app; los datos del socio no salen de
   la UE. En este repositorio, todos los datos son inventados. Detalle en [RGPD.md](RGPD.md).
4. **Accesible para todos.** Todo control tiene nombre accesible, los avisos se anuncian (`role="status"` o
   `role="alert"`) y el texto se lee bien con un 200 % de ampliación.
5. **Pruebas como puerta.** Cada tarea termina con tests, typecheck y lint en verde, con la salida real pegada
   ([IMPLEMENTATION-RULE.md](IMPLEMENTATION-RULE.md)). Prohibido avanzar con pruebas en rojo.
6. **Idioma.** Textos para el socio en español, claros y sin jerga; código, identificadores y commits en inglés.
