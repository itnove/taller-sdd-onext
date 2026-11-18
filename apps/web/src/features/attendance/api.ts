import { badResponse, isRecord, requestJson } from '../../components/http.ts';
import type { CheckInResult, Member } from './types.ts';

function isMember(value: unknown): value is Member {
  return isRecord(value) && typeof value.id === 'number' && typeof value.name === 'string';
}

/** `GET /api/members`: el selector solo recibe `id` y nombre (docs/RGPD.md §6). */
export async function fetchMembers(signal?: AbortSignal): Promise<Member[]> {
  const body = await requestJson('/api/members', { signal });
  if (!isRecord(body) || !Array.isArray(body.members) || !body.members.every(isMember)) {
    throw badResponse();
  }
  return body.members;
}

/** `POST /api/members/:id/checkins`, sin cuerpo. */
export async function checkIn(memberId: number): Promise<CheckInResult> {
  const body = await requestJson(`/api/members/${memberId}/checkins`, { method: 'POST' });
  if (!isRecord(body) || typeof body.day !== 'string' || typeof body.counted !== 'boolean') {
    throw badResponse();
  }
  return { day: body.day, counted: body.counted };
}
