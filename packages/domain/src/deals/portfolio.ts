import { pollPercents } from '../community/poll';

export type PositionStatus = 'committed' | 'in_review' | 'funded';

export interface PositionLike { dealId: string; amountMinor: number; status: PositionStatus; at: string; ref: string }

/** Adds new commitments to existing positions. Money into a round you are already in grows that position (it keeps its status and reference). */
export function mergePositions(baseline: PositionLike[], added: PositionLike[]): PositionLike[] {
  const out = baseline.map((p) => ({ ...p }));
  for (const a of added) {
    const hit = out.find((p) => p.dealId === a.dealId);
    if (hit) hit.amountMinor += a.amountMinor;
    else out.push({ ...a });
  }
  return out;
}

export function totalInvested(positions: Pick<PositionLike, 'amountMinor'>[]): number {
  return positions.reduce((a, p) => a + p.amountMinor, 0);
}

export function totalByStatus(positions: PositionLike[], status: PositionStatus): number {
  return totalInvested(positions.filter((p) => p.status === status));
}

/** Share of money per sector, largest first, whole percentages that add up to 100. */
export function allocationBySector(positions: Pick<PositionLike, 'dealId' | 'amountMinor'>[], sectorOf: (dealId: string) => string): { sector: string; pct: number }[] {
  const sums = new Map<string, number>();
  for (const p of positions) sums.set(sectorOf(p.dealId), (sums.get(sectorOf(p.dealId)) ?? 0) + p.amountMinor);
  const rows = [...sums.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const pcts = pollPercents(rows.map((r) => r[1]));
  return rows.map(([sector], i) => ({ sector, pct: pcts[i] ?? 0 }));
}
