import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Pill.module.css';

export interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/** Filter chip. A toggle button; `selected` sets aria-pressed. */
export function Pill({ selected, className, type = 'button', ...rest }: PillProps) {
  return <button type={type} aria-pressed={selected} className={cx(styles.root, selected && styles.on, className)} {...rest} />;
}
