import type { ReactNode } from 'react';
import styles from './ListRow.module.css';

export function ListRow({ leading, title, meta, trailing }: { leading?: ReactNode; title: string; meta?: string; trailing?: ReactNode }) {
  return (
    <div className={styles.root}>
      {leading}
      <div className={styles.main}>
        <b className={styles.title}>{title}</b>
        {meta ? <span className={styles.meta}>{meta}</span> : null}
      </div>
      {trailing}
    </div>
  );
}
