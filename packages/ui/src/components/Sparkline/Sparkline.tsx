import styles from './Sparkline.module.css';

export const SPARK_W = 60;
export const SPARK_H = 20;

/** Scales a series to the 60x20 box (top = high). Flat series draw a centred line. */
export function sparkPoints(series: number[]): string {
  if (series.length < 2) return '';
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min;
  const pad = 2;
  return series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * SPARK_W;
      const y = span === 0 ? SPARK_H / 2 : pad + (1 - (v - min) / span) * (SPARK_H - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export function Sparkline({ series, tone }: { series: number[]; tone: 'up' | 'down' }) {
  return (
    <svg className={styles.root} viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className={tone === 'up' ? styles.up : styles.down} points={sparkPoints(series)} />
    </svg>
  );
}
