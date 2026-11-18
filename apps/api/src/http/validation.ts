import type { FastifyServerOptions } from 'fastify';

/**
 * Ajv estricto de verdad (DEC-06): sin coerción (`"40"` no es un entero), sin quitar en silencio los campos
 * sobrantes y con todos los errores, para dar un elemento de `details` por campo.
 */
export const ajvOptions = {
  customOptions: { coerceTypes: false, removeAdditional: false, allErrors: true },
} satisfies FastifyServerOptions['ajv'];

/** Sin coerción el ID de la ruta llega como texto: se valida con `pattern` y la ruta lo pasa a `Number()`. */
export const idParamsSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: { id: { type: 'string', pattern: '^[1-9][0-9]{0,14}$' } },
} as const;

export type IdParams = { id: string };
