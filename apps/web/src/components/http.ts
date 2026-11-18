/**
 * Shared HTTP client of the web. It talks to `/api/...`, applies a timeout, understands the error
 * envelope of DEC-06 (`{ error: { code, message, details?, ...extra } }`) and turns every failure into
 * a typed `ApiError`. It never retries on its own and never logs responses.
 *
 * Errors created by the client itself (there is no API envelope) always carry `status: 0` and a
 * `CLIENT_` code, so they never clash with the API codes:
 * - `CLIENT_NETWORK`: no network, or a 5xx without envelope.
 * - `CLIENT_TIMEOUT`: no answer within `timeoutMs`.
 * - `CLIENT_BAD_RESPONSE`: a 2xx that is not JSON, or a 4xx without envelope.
 *
 * A cancellation by the caller's own signal is rethrown untouched (an `AbortError`).
 */

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export type HttpMethod = 'GET' | 'POST' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export const DEFAULT_TIMEOUT_MS = 10_000;
export const CONNECTION_MESSAGE =
  'No se ha podido conectar con el servidor. Vuelve a intentarlo en unos segundos.';
export const BAD_RESPONSE_MESSAGE = 'La respuesta del servidor no es válida. Vuelve a intentarlo.';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorDetail[] | undefined;
  /** Numeric extra fields of the envelope (e.g. `remainingDays`); anything else is dropped. */
  readonly extra: Record<string, number>;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: ApiErrorDetail[],
    extra: Record<string, number> = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.extra = extra;
  }
}

/** Error for a 2xx whose body does not have the expected shape. */
export function badResponse(): ApiError {
  return new ApiError(0, 'CLIENT_BAD_RESPONSE', BAD_RESPONSE_MESSAGE);
}

/** Text to show to the person for any error coming from the client. */
export function userMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : CONNECTION_MESSAGE;
}

/** `true` when the API could not be reached (network, timeout or a 5xx without envelope). */
export function isOffline(error: unknown): boolean {
  return (
    !(error instanceof ApiError) ||
    error.code === 'CLIENT_NETWORK' ||
    error.code === 'CLIENT_TIMEOUT'
  );
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDetail(value: unknown): value is ApiErrorDetail {
  return isRecord(value) && typeof value.field === 'string' && typeof value.message === 'string';
}

function numericExtra(error: Record<string, unknown>): Record<string, number> {
  const extra: Record<string, number> = {};
  for (const [key, value] of Object.entries(error)) {
    if (typeof value === 'number' && Number.isFinite(value)) extra[key] = value;
  }
  return extra;
}

function toEnvelopeError(status: number, value: unknown): ApiError | null {
  if (!isRecord(value) || !isRecord(value.error)) return null;
  const { code, message, details } = value.error;
  if (typeof code !== 'string' || typeof message !== 'string') return null;
  if (details !== undefined && (!Array.isArray(details) || !details.every(isDetail))) return null;
  const copied = details?.map(({ field, message: text }) => ({ field, message: text }));
  return new ApiError(status, code, message, copied, numericExtra(value.error));
}

type Parsed = { ok: true; value: unknown } | { ok: false };

function parseJson(text: string): Parsed {
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false };
  }
}

function interpret(status: number, text: string): unknown {
  if (status === 204) return undefined;
  const parsed = parseJson(text);
  if (status >= 200 && status < 300) {
    if (!parsed.ok) throw badResponse();
    return parsed.value;
  }
  const envelopeError = parsed.ok ? toEnvelopeError(status, parsed.value) : null;
  if (envelopeError) throw envelopeError;
  if (status >= 500) throw new ApiError(0, 'CLIENT_NETWORK', CONNECTION_MESSAGE);
  throw badResponse();
}

async function send(
  path: string,
  init: RequestInit,
  callerSignal: AbortSignal | undefined,
  timeoutSignal: AbortSignal,
): Promise<{ status: number; text: string }> {
  try {
    const response = await fetch(path, init);
    return { status: response.status, text: await response.text() };
  } catch (error) {
    if (callerSignal?.aborted) throw error;
    const code = timeoutSignal.aborted ? 'CLIENT_TIMEOUT' : 'CLIENT_NETWORK';
    throw new ApiError(0, code, CONNECTION_MESSAGE);
  }
}

/**
 * Sends a request to the API and returns the parsed JSON body (`undefined` for a 204).
 * `Content-Type: application/json` is set only when there is a `body`.
 */
export async function requestJson(path: string, options: RequestOptions = {}): Promise<unknown> {
  const { method = 'GET', body, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const init: RequestInit = {
    method,
    signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
  };
  if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(body);
  }
  const { status, text } = await send(path, init, signal, timeoutSignal);
  return interpret(status, text);
}
