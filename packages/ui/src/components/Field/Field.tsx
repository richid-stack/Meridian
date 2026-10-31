import type { InputHTMLAttributes } from 'react';
import styles from './Field.module.css';

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Accessible name, required: a placeholder is not a label. */
  label: string;
  /** When both are set, a clear button shows while the field has text. */
  clearLabel?: string;
  onClear?: () => void;
}

export function Field({ label, clearLabel, onClear, className, ...rest }: FieldProps) {
  const hasText = typeof rest.value === 'string' && rest.value.length > 0;
  return (
    <div className={styles.root}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" />
      </svg>
      <input type="search" aria-label={label} className={styles.input} {...rest} />
      {clearLabel && onClear && hasText ? (
        <button type="button" className={styles.clear} onClick={onClear}>{clearLabel}</button>
      ) : null}
    </div>
  );
}
