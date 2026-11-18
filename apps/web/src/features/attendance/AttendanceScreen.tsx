import { useEffect, useState } from 'react';
import { userMessage } from '../../components/http.ts';
import { ErrorMessage, LoadingMessage } from '../../components/StatusMessages.tsx';
import { fetchMembers } from './api.ts';
import { CheckInButton } from './CheckInButton.tsx';
import { StreakPanel } from './StreakPanel.tsx';
import type { Member } from './types.ts';

type MembersState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; members: Member[] };

/** Carga los socios y los mantiene; `reload` vuelve a pedirlos (reintento). */
function useMembers(): [MembersState, () => void] {
  const [state, setState] = useState<MembersState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchMembers(controller.signal)
      .then((members) => setState({ status: 'ready', members }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setState({ status: 'error', message: userMessage(error) });
      });
    return () => controller.abort();
  }, [attempt]);

  function reload() {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }
  return [state, reload];
}

/** Pantalla del socio: elige su nombre, ve su racha (HU-01) y hace check-in (T-02). */
export function AttendanceScreen() {
  const [members, reload] = useMembers();
  const [selected, setSelected] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (members.status === 'loading') return <LoadingMessage>Cargando socios…</LoadingMessage>;
  if (members.status === 'error')
    return <ErrorMessage message={members.message} onRetry={reload} />;
  if (members.members.length === 0) return <p>Todavía no hay socios.</p>;

  const memberId = selected ?? members.members[0]!.id;
  return (
    <section aria-label="Tu asistencia">
      <label htmlFor="member">Socio</label>
      <select
        id="member"
        value={memberId}
        onChange={(event) => setSelected(Number(event.target.value))}
      >
        {members.members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
      <StreakPanel key={memberId} memberId={memberId} refreshKey={refreshKey} />
      <CheckInButton
        key={`check-in-${memberId}`}
        memberId={memberId}
        onCheckedIn={() => setRefreshKey((n) => n + 1)}
      />
    </section>
  );
}
