/** The watched rounds once a person's own changes are applied to the starting list. Order of the starting list is kept; new rounds go last. */
export function effectiveWatch(baseline: string[], overrides: Record<string, boolean>): string[] {
  const out = baseline.filter((id) => overrides[id] !== false);
  for (const [id, on] of Object.entries(overrides)) if (on && !out.includes(id)) out.push(id);
  return out;
}
