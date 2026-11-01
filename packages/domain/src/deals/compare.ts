export type Side = 'a' | 'b';

/** Picks a round for one side. Choosing the round already on the other side swaps them, so the sides never match. */
export function selectRound(current: { a: string; b: string }, side: Side, id: string): { a: string; b: string } {
  const other: Side = side === 'a' ? 'b' : 'a';
  if (current[other] === id) return { ...current, [other]: current[side], [side]: id } as { a: string; b: string };
  return { ...current, [side]: id } as { a: string; b: string };
}

/** Which round is further along. A tie goes to side a and is flagged. */
export function compareFunding(a: { fundedPct: number }, b: { fundedPct: number }): { lead: Side; tie: boolean; leadPct: number; trailPct: number } {
  const tie = a.fundedPct === b.fundedPct;
  const lead: Side = b.fundedPct > a.fundedPct ? 'b' : 'a';
  const leadPct = lead === 'a' ? a.fundedPct : b.fundedPct;
  const trailPct = lead === 'a' ? b.fundedPct : a.fundedPct;
  return { lead, tie, leadPct, trailPct };
}
