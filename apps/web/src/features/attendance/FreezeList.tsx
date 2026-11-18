import { formatCalendarDate } from '../../components/format.ts';
import type { Freeze } from './types.ts';

/** Congelaciones activas; "Cancelar" solo en las que empiezan después de hoy (RN-07, DD-06). */
export function FreezeList({
  freezes,
  today,
  onCancel,
}: {
  freezes: Freeze[];
  today: string;
  onCancel: (freeze: Freeze) => void;
}) {
  if (freezes.length === 0) return <p>No tienes ninguna congelación.</p>;
  return (
    <ul aria-label="Tus congelaciones">
      {freezes.map((freeze) => {
        const text = `Del ${formatCalendarDate(freeze.start)} al ${formatCalendarDate(freeze.end)}`;
        return (
          <li key={freeze.id}>
            {text}{' '}
            {freeze.start > today ? (
              <button
                type="button"
                aria-label={`Cancelar: ${text}`}
                onClick={() => onCancel(freeze)}
              >
                Cancelar
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
