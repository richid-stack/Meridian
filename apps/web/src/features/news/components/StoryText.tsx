'use client';

import { useState } from 'react';
import styles from './News.module.css';

/** Title and summary, with a switch between the original and the English translation of a non-English story. */
export function StoryText({ original, translation, lang, t }: {
  original: { title: string; snippet: string };
  translation: { title: string; snippet: string } | null;
  lang: string;
  t: Record<string, string>;
}) {
  const [translated, setTranslated] = useState(false);
  const shown = translated && translation ? translation : original;
  return (
    <>
      <h1>{shown.title}</h1>
      {translation ? (
        <p>
          <button type="button" className={styles.tr} onClick={() => setTranslated((v) => !v)}>
            {translated ? (t.showOriginal ?? '').replace('{lang}', lang.toUpperCase()) : t.translate}
          </button>
          {translated ? <span className={styles.trNote}>{t.translatedBy}</span> : null}
        </p>
      ) : null}
      <p className={styles.lede}>{shown.snippet}</p>
    </>
  );
}
