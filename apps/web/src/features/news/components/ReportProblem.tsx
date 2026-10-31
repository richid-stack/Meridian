'use client';

import { useState } from 'react';
import styles from './News.module.css';

/** Sample behaviour: nothing is sent until the moderation module exists. */
export function ReportProblem({ label, thanks }: { label: string; thanks: string }) {
  const [sent, setSent] = useState(false);
  return (
    <>
      <button type="button" className={styles.linkBtn} onClick={() => setSent(true)}>{label}</button>
      <p className={styles.thanks} role="status">{sent ? thanks : ''}</p>
    </>
  );
}
