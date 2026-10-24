import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className={styles.root}>
      <h3 className={styles.title}>{title}</h3>
      {children ? <p className={styles.body}>{children}</p> : null}
      {action}
    </div>
  );
}
