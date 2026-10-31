/** Percent change from the first to the last point, rounded. 0 for fewer than two points or a zero start. */
export function growthPct(series: number[]): number {
  const first = series[0];
  const last = series[series.length - 1];
  if (series.length < 2 || first === undefined || last === undefined || first === 0) return 0;
  return Math.round((last / first - 1) * 100);
}
