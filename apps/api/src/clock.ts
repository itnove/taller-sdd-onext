/** Reloj inyectado (DEC-07): la API pide la hora a `now()` para que los tests la puedan fijar. */
export type Clock = () => Date;

export const systemClock: Clock = () => new Date();
