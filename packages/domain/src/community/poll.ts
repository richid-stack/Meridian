/** Whole-number percentages that always add up to 100 (largest remainder method). All zeros when nobody has voted. */
export function pollPercents(votes: number[]): number[] {
  const total = votes.reduce((a, b) => a + b, 0);
  if (total === 0) return votes.map(() => 0);
  const exact = votes.map((v) => (v / total) * 100);
  const floor = exact.map(Math.floor);
  let left = 100 - floor.reduce((a, b) => a + b, 0);
  const order = exact.map((e, i) => ({ i, r: e - Math.floor(e) })).sort((a, b) => b.r - a.r || a.i - b.i);
  for (const { i } of order) {
    if (left <= 0) break;
    floor[i] = (floor[i] ?? 0) + 1;
    left--;
  }
  return floor;
}

export function totalVotes(options: { votes: number }[]): number {
  return options.reduce((a, o) => a + o.votes, 0);
}

/** A new options list with one more vote on `optionId`. Unknown ids change nothing. */
export function addVote<T extends { id: string; votes: number }>(options: T[], optionId: string): T[] {
  return options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o));
}
