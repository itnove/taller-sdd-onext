import { useEffect, useState } from 'react';
import { userMessage } from '../../components/http.ts';
import { ErrorMessage, LoadingMessage } from '../../components/StatusMessages.tsx';
import { fetchStreak } from './api.ts';
import { streakView, type StreakView } from './streak-view.ts';

type PanelState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; view: StreakView };

/** Carga la racha del socio; se repite al cambiar de socio, al hacer check-in (`refreshKey`) o al reintentar. */
function useStreak(memberId: number, refreshKey: number): [PanelState, () => void] {
  const [state, setState] = useState<PanelState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchStreak(memberId, controller.signal)
      .then((streak) => setState({ status: 'ready', view: streakView(streak) }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: userMessage(error) });
      });
    return () => controller.abort();
  }, [memberId, refreshKey, attempt]);

  function retry() {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }
  return [state, retry];
}

/** Panel de la racha (HU-01): un dato principal, grande, y sus estados (TECHNICAL_DOC-frontend). */
export function StreakPanel({ memberId, refreshKey }: { memberId: number; refreshKey: number }) {
  const [state, retry] = useStreak(memberId, refreshKey);

  if (state.status === 'loading') return <LoadingMessage>Cargando tu racha…</LoadingMessage>;
  if (state.status === 'error') return <ErrorMessage message={state.message} onRetry={retry} />;

  const { view } = state;
  return (
    <div className="card" role="status" aria-label="Tu racha">
      {view.number ? <p className="streak-number">{view.number}</p> : null}
      {view.label ? <p>{view.label}</p> : null}
      {view.message ? <p className="congrats">{view.message}</p> : null}
      {view.notice ? <p className="notice">{view.notice}</p> : null}
    </div>
  );
}
