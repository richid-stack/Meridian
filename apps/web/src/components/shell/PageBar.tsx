'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PageBar.module.css';

interface Props {
  title: string;
  backLabel: string;
  fallbackHref: string;
  /** Right-hand controls, such as a bookmark. */
  actions?: ReactNode;
  /** Replaces the default "go back in history" behaviour (a step inside a flow). */
  onBack?: () => void;
  backDisabled?: boolean;
}

/** Back bar for detail pages. Falls back to a fixed route when there is no history (a shared link). */
export function PageBar({ title, backLabel, fallbackHref, actions, onBack, backDisabled }: Props) {
  const router = useRouter();
  const back = () => {
    if (onBack) onBack();
    else if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };
  return (
    <header className={styles.root}>
      <div className={styles.in}>
        <button type="button" className={styles.back} onClick={back} disabled={backDisabled} aria-label={backLabel}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span className={styles.title}>{title}</span>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </header>
  );
}
