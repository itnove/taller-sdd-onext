# Reglas de negocio validadas de GymApp

- **Fuente:** respuestas de Nuria (PO de GymTonic) en el shaping de cada feature, validadas por escrito.
- **Uso:** el shaping de cada feature cita estas reglas como fuente (`RV-NN`) y las convierte en sus `RN-NN`, casos
  de uso e invariantes. Una pregunta de shaping que ya responda una `RV-NN` no se vuelve a hacer; las que no estén
  cubiertas se preguntan.
- **Cambios:** una regla validada solo cambia con una nueva validación; se anota aquí con fecha, sin borrar la anterior.
- Rol único: "socio", sin login ([DEC-04](../07_architecture_principles/DECISIONS.md)). Principios:
  [CONSTITUCION.md](../CONSTITUCION.md). Datos personales: [RGPD.md](../RGPD.md).

## Asistencia (módulo `asistencia`)

Validadas por Nuria en el shaping de FEAT-01 (2026-11-16, respuestas R1-R6).

- **RV-01 · Día.** Un día es el día de calendario del gimnasio de alta; hoy todos están en Madrid (Europe/Madrid).
- **RV-02 · Un check-in por día.** Varios check-ins el mismo día cuentan como uno.
- **RV-03 · La racha.** Días seguidos con check-in. Hasta que acaba el día el socio puede venir: la racha se rompe con
  un día completo sin venir.
- **RV-04 · Felicitación.** Un mensaje a partir de 7 días. Sin premios.
- **RV-05 · Sin conexión.** El socio ve su última racha guardada con un aviso; el check-in sin conexión, más adelante.
- **RV-06 · Rapidez.** La racha carga en menos de 300 ms.

Validadas por Nuria en el shaping de FEAT-02 (2026-11-18, respuestas R1-R7).

- **RV-07 · Congelar.** Hasta 7 días por año natural, en uno o varios rangos de días seguidos, desde hoy en adelante;
  si un rango cruza de año, cada día cuenta en su año. Sin solapes. Ni suma ni rompe la racha; venir un día congelado
  cuenta. Se cancela solo antes de empezar y los días vuelven al cupo. Sin motivo, aprobación ni avisos.
