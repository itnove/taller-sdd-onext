import { useState } from 'react';
import { isOffline, userMessage } from '../../components/http.ts';
import { Notice } from '../../components/StatusMessages.tsx';
import { checkIn } from './api.ts';

export const CHECKED_IN = 'Check-in registrado.';
export const ALREADY_CHECKED_IN = 'Hoy ya tenías check-in.';
export const CHECK_IN_OFFLINE = 'Sin conexión: el check-in no se ha podido registrar.';

/** Botón de check-in de hoy, con su aviso. Deshabilitado mientras se envía (evita el doble envío). */
export function CheckInButton({
  memberId,
  onCheckedIn,
}: {
  memberId: number;
  onCheckedIn?: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  async function handleClick() {
    setSending(true);
    try {
      const result = await checkIn(memberId);
      setMessage(result.counted ? CHECKED_IN : ALREADY_CHECKED_IN);
    } catch (error) {
      setMessage(isOffline(error) ? CHECK_IN_OFFLINE : userMessage(error));
    } finally {
      setSending(false);
      onCheckedIn?.();
    }
  }

  return (
    <div className="check-in">
      <button type="button" onClick={() => void handleClick()} disabled={sending}>
        Hacer check-in hoy
      </button>
      {message ? <Notice>{message}</Notice> : null}
    </div>
  );
}
