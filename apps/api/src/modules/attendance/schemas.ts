/** JSON Schema de las respuestas del módulo asistencia: filtran cualquier campo que no se declare (DEC-06). */

export const membersResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['members'],
  properties: {
    members: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'name'],
        properties: { id: { type: 'integer' }, name: { type: 'string' } },
      },
    },
  },
} as const;

export const checkInResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['day', 'counted'],
  properties: { day: { type: 'string' }, counted: { type: 'boolean' } },
} as const;
