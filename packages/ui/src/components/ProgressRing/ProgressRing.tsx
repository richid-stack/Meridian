import styles from './ProgressRing.module.css';

/** Deal progress as a ring with the percentage inside. */
export function ProgressRing({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <span className={styles.root} style={{ background: `conic-gradient(var(--accent) ${pct}%, var(--rule) 0)` }} role="img" aria-label={`${label}: ${pct}%`}>
      <span className={styles.inner} aria-hidden="true">{pct}%</span>
    </span>
  );
}
