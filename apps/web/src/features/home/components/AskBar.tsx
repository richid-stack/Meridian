import styles from './AskBar.module.css';

/** A plain GET form to the assistant: works without JavaScript. */
export function AskBar({ locale, label, placeholder }: { locale: string; label: string; placeholder: string }) {
  return (
    <form className={styles.root} action={`/${locale}/assistant`} method="get" role="search">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      </svg>
      <input name="q" className={styles.input} aria-label={label} placeholder={placeholder} autoComplete="off" />
    </form>
  );
}
