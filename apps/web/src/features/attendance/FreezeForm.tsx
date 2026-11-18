import { useState, type FormEvent } from 'react';
import { ApiError, isOffline, userMessage } from '../../components/http.ts';
import { createFreeze } from './freeze-api.ts';
import type { FreezeResult } from './types.ts';

export const FREEZE_OFFLINE = 'Sin conexión: no se ha podido congelar. Inténtalo de nuevo.';

type FieldErrors = { start?: string; end?: string };

interface Failure {
  fields: FieldErrors;
  form: string;
}

/** Un 400 va junto al campo que nombra `details` (DD-05); un 409 o sin conexión, bajo el formulario (EC-13). */
function toFailure(error: unknown): Failure {
  if (isOffline(error)) return { fields: {}, form: FREEZE_OFFLINE };
  if (error instanceof ApiError && error.code === 'VALIDATION_ERROR' && error.details) {
    const fields: FieldErrors = {};
    for (const { field, message } of error.details) {
      if (field === 'start' || field === 'end') fields[field] ??= message;
    }
    if (fields.start || fields.end) return { fields, form: '' };
  }
  return { fields: {}, form: userMessage(error) };
}

function DateField(props: {
  id: string;
  label: string;
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
}) {
  const errorId = `${props.id}-error`;
  return (
    <div className="field">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type="date"
        value={props.value}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? errorId : undefined}
        onChange={(event) => props.onChange(event.target.value)}
      />
      {props.error ? (
        <p id={errorId} role="alert" className="error-text">
          {props.error}
        </p>
      ) : null}
    </div>
  );
}

/** Estado y envío del formulario: conserva lo escrito si algo falla y vacía los campos al congelar. */
function useFreezeForm(memberId: number, onCreated: (result: FreezeResult) => void) {
  const [range, setRange] = useState({ start: '', end: '' });
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<Failure>({ fields: {}, form: '' });

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    try {
      const result = await createFreeze(memberId, range);
      setRange({ start: '', end: '' });
      setFailure({ fields: {}, form: '' });
      onCreated(result);
    } catch (error) {
      setFailure(toFailure(error));
    } finally {
      setSending(false);
    }
  }

  return { range, setRange, sending, failure, submit };
}

/** Formulario "Desde / Hasta" (HU-02). Deshabilitado mientras envía (EC-16); sin campo de motivo (RNF-04). */
export function FreezeForm({
  memberId,
  onCreated,
}: {
  memberId: number;
  onCreated: (result: FreezeResult) => void;
}) {
  const { range, setRange, sending, failure, submit } = useFreezeForm(memberId, onCreated);
  return (
    <form onSubmit={(event) => void submit(event)} noValidate aria-label="Congelar mi racha">
      <DateField
        id="freeze-start"
        label="Desde"
        value={range.start}
        error={failure.fields.start}
        onChange={(start) => setRange((r) => ({ ...r, start }))}
      />
      <DateField
        id="freeze-end"
        label="Hasta"
        value={range.end}
        error={failure.fields.end}
        onChange={(end) => setRange((r) => ({ ...r, end }))}
      />
      <button type="submit" disabled={sending}>
        Congelar
      </button>
      {failure.form ? (
        <p role="alert" className="error-text">
          {failure.form}
        </p>
      ) : null}
    </form>
  );
}
