import type { ReactNode } from 'react';
import styles from './AiLabel.module.css';

/** AI text is always labelled and always shows its sources. */
export function AiLabel({ label, sources, children }: { label: string; sources: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.root}>
      <b className={styles.label}>{label}</b>
      <div className={styles.text}>{children}</div>
      <div className={styles.sources}>{sources}</div>
    </div>
  );
}
