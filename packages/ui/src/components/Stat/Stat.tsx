import styles from './Stat.module.css';

/** Mono figures on the dark panel. `up` is a gold caption such as growth. */
export function StatPanel({ stats, caption }: { stats: { label: string; value: string }[]; caption?: string }) {
  return (
    <div className={styles.panel}>
      <div className={styles.grid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.cell}>
            <span className={styles.label}>{s.label}</span>
            <strong className={styles.value}>{s.value}</strong>
          </div>
        ))}
      </div>
      {caption ? <span className={styles.caption}>{caption}</span> : null}
    </div>
  );
}
export const Stat = StatPanel;
