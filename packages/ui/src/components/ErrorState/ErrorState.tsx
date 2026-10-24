import type { ReactNode } from 'react';
import styles from './ErrorState.module.css';

export function ErrorState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className={styles.root} role="alert">
      <h3 className={styles.title}>{title}</h3>
      {children ? <p className={styles.body}>{children}</p> : null}
      {action}
    </div>
  );
}
