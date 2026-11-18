import { badResponse, isRecord, requestJson } from '../../components/http.ts';
import type { Freeze, FreezeListResponse, FreezeRange, FreezeResult } from './types.ts';

/** Cliente de las congelaciones (HU-02). Una forma inesperada es un error, nunca datos inventados. */

function isFreeze(value: unknown): value is Freeze {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.start === 'string' &&
    typeof value.end === 'string' &&
    typeof value.createdAt === 'string' &&
    (value.cancelledAt === null || typeof value.cancelledAt === 'string')
  );
}

function isFreezeResult(value: unknown): value is FreezeResult {
  return isRecord(value) && isFreeze(value.freeze) && typeof value.remainingDays === 'number';
}

export async function fetchFreezes(
  memberId: number,
  signal?: AbortSignal,
): Promise<FreezeListResponse> {
  const body = await requestJson(`/api/members/${memberId}/freezes`, { signal });
  if (
    !isRecord(body) ||
    typeof body.today !== 'string' ||
    typeof body.remainingDays !== 'number' ||
    !Array.isArray(body.freezes) ||
    !body.freezes.every(isFreeze)
  ) {
    throw badResponse();
  }
  return { today: body.today, remainingDays: body.remainingDays, freezes: body.freezes };
}

export async function createFreeze(memberId: number, range: FreezeRange): Promise<FreezeResult> {
  const body = await requestJson(`/api/members/${memberId}/freezes`, {
    method: 'POST',
    body: { start: range.start, end: range.end },
  });
  if (!isFreezeResult(body)) throw badResponse();
  return body;
}

export async function cancelFreeze(memberId: number, freezeId: number): Promise<FreezeResult> {
  const body = await requestJson(`/api/members/${memberId}/freezes/${freezeId}`, {
    method: 'DELETE',
  });
  if (!isFreezeResult(body)) throw badResponse();
  return body;
}
