import type { ReactNode } from 'react';
import styles from './Profile.module.css';

export function SnapshotPanel({ title, stage, stats, children }: { title: string; stage: string; stats: { label: string; value: string }[]; children: ReactNode }) {
  return (
    <section className={styles.panel} aria-label={title}>
      <div className={styles.ph}><b>{title}</b><span>{stage}</span></div>
      <div className={styles.grid}>
        {stats.map((s) => (<div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>))}
      </div>
      {children}
    </section>
  );
}
