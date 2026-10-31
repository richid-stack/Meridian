import styles from './TrendLine.module.css';

/** Polyline points for a series in a w x h box (top = high). Flat series draw a centred line. */
export function trendPoints(series: number[], w = 300, h = 48): string {
  if (series.length < 2) return '';
  const pad = 4;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min;
  return series
    .map((v, i) => {
      const x = 2 + i * ((w - 4) / (series.length - 1));
      const y = span === 0 ? h / 2 : h - pad - ((v - min) / span) * (h - pad * 2);
      return `${Math.round(x)},${Math.round(y)}`;
    })
    .join(' ');
}

export function TrendLine({ series }: { series: number[] }) {
  return (
    <svg className={styles.root} viewBox="0 0 300 48" preserveAspectRatio="none" aria-hidden="true">
      <polyline className={styles.line} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" points={trendPoints(series)} />
    </svg>
  );
}
