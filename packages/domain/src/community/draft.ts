export const MAX_POST_CHARS = 500;
export const MAX_OPTION_CHARS = 80;
export const MIN_POLL_OPTIONS = 2;
export const MAX_POLL_OPTIONS = 4;

export type DraftError = 'empty' | 'tooLong' | 'pollOptions' | 'returnPromise';

export interface Draft {
  type: 'insight' | 'question' | 'poll';
  text: string;
  options: string[];
  /** True when a deal is attached. Posts about investments must not promise returns. */
  hasDeal: boolean;
}

// Wording that promises or implies guaranteed gains. English and French. This is a first guard, not a moderation system:
// the server must check again, and human review (backend step B7) catches what patterns cannot.
const RETURN_PROMISES: RegExp[] = [
  /\bguarantee[sd]?\b[^.!?]{0,40}\b(return|returns|profit|profits|gain|gains|yield|income)\b/i,
  /\b(return|returns|profit|profits|yield)\b[^.!?]{0,20}\bguarantee[sd]?\b/i,
  /\brisk[- ]free\b/i,
  /\bno[- ]risk\b/i,
  /\b(can'?t|cannot|won'?t|will not)\s+lose\b/i,
  /\bdouble your (money|investment)\b/i,
  /\bsure (profit|thing|win)\b/i,
  /\bwill (return|earn|make|pay)\b[^.!?]{0,30}\d+\s?%/i,
  /\brendement garanti\b/i,
  /\bsans risque\b/i,
  /\bdoubler (votre|ton) (argent|investissement)\b/i,
];

export function findReturnPromise(text: string): boolean {
  return RETURN_PROMISES.some((r) => r.test(text));
}

/** Everything wrong with a draft. An empty list means it can be posted. */
export function validateDraft(d: Draft): DraftError[] {
  const errors: DraftError[] = [];
  const text = d.text.trim();
  if (!text) errors.push('empty');
  if (d.text.length > MAX_POST_CHARS) errors.push('tooLong');
  if (d.type === 'poll') {
    const filled = d.options.map((o) => o.trim()).filter(Boolean);
    if (filled.length < MIN_POLL_OPTIONS || filled.length > MAX_POLL_OPTIONS || filled.some((o) => o.length > MAX_OPTION_CHARS)) errors.push('pollOptions');
  }
  if (d.hasDeal && findReturnPromise(d.text)) errors.push('returnPromise');
  return errors;
}
