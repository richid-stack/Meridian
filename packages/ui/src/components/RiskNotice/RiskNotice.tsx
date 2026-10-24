import type { ReactNode } from 'react';
import styles from './RiskNotice.module.css';

/** Honest risk beside every investment screen. Equal visual weight to the upside, never hidden. */
export function RiskNotice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className={styles.root} aria-label={title}>
      <strong className={styles.title}>{title}</strong>
      <p className={styles.body}>{children}</p>
    </aside>
  );
}
