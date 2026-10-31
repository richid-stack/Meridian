import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './Section.module.css';

export function Section({ title, linkLabel, href, children }: { title: string; linkLabel?: string; href?: string; children: ReactNode }) {
  return (
    <section>
      <h2 className={styles.head}>
        {title}
        {linkLabel && href ? <Link href={href} className={styles.link}>{linkLabel}</Link> : null}
      </h2>
      {children}
    </section>
  );
}
