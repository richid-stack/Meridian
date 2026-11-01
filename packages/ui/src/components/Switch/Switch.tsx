import type { ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Switch.module.css';

export interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** The visible label. It is also the accessible name, so the whole row toggles. */
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** On/off setting. A real switch for assistive tech; the whole row is the tap target (44px tall). */
export function Switch({ checked, onChange, children, disabled, className }: SwitchProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} disabled={disabled} className={cx(styles.root, className)} onClick={() => onChange(!checked)}>
      <span>{children}</span>
      <span className={styles.track} aria-hidden="true"><i className={styles.thumb} /></span>
    </button>
  );
}
