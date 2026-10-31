import styles from './TrendBars.module.css';

export interface Bar { x: number; y: number; width: number; height: number; cx: number; valueY: number; last: boolean; label: string; value: number }

/** Geometry for bars in a 300 x 118 box, baseline at y=92. */
export function barLayout(data: { label: string; value: number }[]): Bar[] {
  if (data.length === 0) return [];
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = 300 / (data.length + 1);
  const width = Math.min(56, Math.round(slot * 0.7));
  return data.map((d, i) => {
    const height = Math.round((d.value / max) * 78);
    const cx = Math.round((i + 1) * slot);
    return { x: cx - Math.round(width / 2), y: 92 - height, width, height, cx, valueY: 86 - height, last: i === data.length - 1, label: d.label, value: d.value };
  });
}

export function TrendBars({ data, label }: { data: { label: string; value: number }[]; label: string }) {
  const bars = barLayout(data);
  return (
    <svg className={styles.root} viewBox="0 0 300 118" role="img" aria-label={label}>
      <line x1="0" y1="92" x2="300" y2="92" className={styles.base} />
      {bars.map((b) => (
        <g key={b.label}>
          <rect x={b.x} y={b.y} width={b.width} height={b.height} rx="2" className={styles.bar} opacity={b.last ? 1 : 0.55} />
          <text x={b.cx} y={b.valueY} textAnchor="middle" className={styles.value}>{b.value}</text>
          <text x={b.cx} y="108" textAnchor="middle" className={styles.label}>{b.label}</text>
        </g>
      ))}
    </svg>
  );
}
