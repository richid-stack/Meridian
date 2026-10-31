import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = ink pill, outline = hairline pill, go = the one key action per screen */
  variant?: 'primary' | 'outline' | 'go';
  full?: boolean;
}

/** Class names for link-styled buttons (an <a> that looks like a Button). */
export function buttonClass(variant: ButtonProps['variant'] = 'primary', full?: boolean): string {
  return cx(styles.root, styles[variant], full && styles.full);
}

export function Button({ variant = 'primary', full, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx(styles.root, styles[variant], full && styles.full, className)} {...rest} />;
}
