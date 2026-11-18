export interface ErrorDetail {
  field: string;
  message: string;
}

/**
 * Error de dominio con `code` estable (DEC-06). Lo lanza el servicio y lo traduce al envelope el único manejador de
 * errores (`apps/api/src/http/error-handler.ts`). El `message` nunca repite el valor recibido ni datos personales.
 * `extra` lleva campos adicionales del error que la web necesita (p. ej., los días que quedan de un cupo).
 */
export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details: ErrorDetail[] | undefined;
  readonly extra: Record<string, number | string> | undefined;

  constructor(
    code: string,
    statusCode: number,
    message: string,
    details?: ErrorDetail[],
    extra?: Record<string, number | string>,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.extra = extra;
  }
}

export function notFound(code: string, message: string): AppError {
  return new AppError(code, 404, message);
}

export function validationError(details: ErrorDetail[]): AppError {
  return new AppError('VALIDATION_ERROR', 400, 'Hay campos con errores.', details);
}
