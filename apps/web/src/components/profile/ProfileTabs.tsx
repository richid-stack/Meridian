'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '@meridian/ui';
import styles from './Profile.module.css';

export interface TabSection { id: string; label: string; content: ReactNode }

/** Accessible tabs: arrow keys, Home and End move between tabs; each panel is labelled by its tab. */
export function ProfileTabs({ sections, label }: { sections: TabSection[]; label: string }) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = sections.length - 1;
    const next = e.key === 'ArrowRight' ? (i + 1) % sections.length : e.key === 'ArrowLeft' ? (i - 1 + sections.length) % sections.length : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    const id = sections[next]?.id;
    if (id) { setActive(id); refs.current[id]?.focus(); }
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className={styles.tabs}>
        {sections.map((s, i) => (
          <button
            key={s.id} ref={(el) => { refs.current[s.id] = el; }} role="tab" type="button"
            id={`tab-${s.id}`} aria-controls={`panel-${s.id}`} aria-selected={s.id === active} tabIndex={s.id === active ? 0 : -1}
            className={cx(styles.tab, s.id === active && styles.tabOn)} onClick={() => setActive(s.id)} onKeyDown={(e) => onKey(e, i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      {sections.map((s) => (
        <section key={s.id} role="tabpanel" id={`panel-${s.id}`} aria-labelledby={`tab-${s.id}`} hidden={s.id !== active} className={styles.tabPanel}>
          {s.content}
        </section>
      ))}
    </div>
  );
}
