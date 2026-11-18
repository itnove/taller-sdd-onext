import { useEffect, useState } from 'react';
import { formatCalendarDate } from '../../components/format.ts';
import { isOffline, userMessage } from '../../components/http.ts';
import { ErrorMessage, LoadingMessage, Notice } from '../../components/StatusMessages.tsx';
import { cancelFreeze, fetchFreezes } from './freeze-api.ts';
import { FreezeForm } from './FreezeForm.tsx';
import { FreezeList } from './FreezeList.tsx';
import type { Freeze, FreezeListResponse, FreezeResult } from './types.ts';

export const CANCEL_OFFLINE = 'Sin conexión: no se ha podido cancelar. Inténtalo de nuevo.';

type ListState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: FreezeListResponse };

/** Carga las congelaciones del socio; `reload` las vuelve a pedir (tras congelar, cancelar o reintentar). */
function useFreezes(memberId: number): [ListState, () => void] {
  const [state, setState] = useState<ListState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchFreezes(memberId, controller.signal)
      .then((data) => setState({ status: 'ready', data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setState({ status: 'error', message: userMessage(error) });
      });
    return () => controller.abort();
  }, [memberId, attempt]);

  return [state, () => setAttempt((n) => n + 1)];
}

const remainingText = (days: number) =>
  `Te quedan ${days} ${days === 1 ? 'día' : 'días'} para congelar este año.`;

/** Sección "Congelar mi racha" (HU-02): cupo, formulario y lista. `onChanged` hace que se recargue la racha. */
export function FreezeSection({
  memberId,
  onChanged,
}: {
  memberId: number;
  onChanged: () => void;
}) {
  const [state, reload] = useFreezes(memberId);
  const [notice, setNotice] = useState('');

  function afterChange(message: string) {
    setNotice(message);
    reload();
    onChanged();
  }

  function handleCreated({ freeze }: FreezeResult) {
    const range = `del ${formatCalendarDate(freeze.start)} al ${formatCalendarDate(freeze.end)}`;
    afterChange(`Racha congelada ${range}.`);
  }

  async function handleCancel(freeze: Freeze) {
    try {
      await cancelFreeze(memberId, freeze.id);
      afterChange('Congelación cancelada.');
    } catch (error) {
      setNotice(isOffline(error) ? CANCEL_OFFLINE : userMessage(error));
    }
  }

  return (
    <section aria-labelledby="freeze-title" className="card">
      <h2 id="freeze-title">Congelar mi racha</h2>
      {state.status === 'loading' ? (
        <LoadingMessage>Cargando tus congelaciones…</LoadingMessage>
      ) : null}
      {state.status === 'error' ? <ErrorMessage message={state.message} onRetry={reload} /> : null}
      {state.status === 'ready' ? (
        <>
          <p>{remainingText(state.data.remainingDays)}</p>
          <FreezeList
            freezes={state.data.freezes}
            today={state.data.today}
            onCancel={(f) => void handleCancel(f)}
          />
        </>
      ) : null}
      <FreezeForm memberId={memberId} onCreated={handleCreated} />
      {notice ? <Notice>{notice}</Notice> : null}
    </section>
  );
}
