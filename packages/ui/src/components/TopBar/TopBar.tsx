import type { ReactNode } from 'react';
import styles from './TopBar.module.css';

/** Sticky page header: wordmark left, optional actions right. */
export function TopBar({ actions }: { actions?: ReactNode }) {
  return (
    <header className={styles.root}>
      <div className={styles.in}>
        <span className={styles.logo}>Meridian<i /></span>
        <div className={styles.actions}>{actions}</div>
      </div>
    </header>
  );
}
