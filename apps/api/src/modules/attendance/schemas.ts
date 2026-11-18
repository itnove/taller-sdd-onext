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

export const streakResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['memberId', 'today', 'days', 'congratulate'],
  properties: {
    memberId: { type: 'integer' },
    today: { type: 'string' },
    days: { type: 'integer', minimum: 0 },
    congratulate: { type: 'boolean' },
  },
} as const;

/** Cuerpo de `POST /freezes`: solo el rango. Un campo de más (p. ej., un motivo) es un 400 (HU-02, RNF-04). */
export const freezeBodySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['start', 'end'],
  properties: {
    start: { type: 'string', maxLength: 10 },
    end: { type: 'string', maxLength: 10 },
  },
} as const;

export type FreezeBody = { start: string; end: string };

/** Una congelación en las respuestas: sin `memberId` ni nombre (RGPD §6). */
export const freezeSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'start', 'end', 'createdAt', 'cancelledAt'],
  properties: {
    id: { type: 'integer' },
    start: { type: 'string' },
    end: { type: 'string' },
    createdAt: { type: 'string' },
    cancelledAt: { type: ['string', 'null'] },
  },
} as const;

export const freezeResultSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['freeze', 'remainingDays'],
  properties: { freeze: freezeSchema, remainingDays: { type: 'integer', minimum: 0 } },
} as const;

export const freezeListSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['today', 'remainingDays', 'freezes'],
  properties: {
    today: { type: 'string' },
    remainingDays: { type: 'integer', minimum: 0 },
    freezes: { type: 'array', items: freezeSchema },
  },
} as const;
