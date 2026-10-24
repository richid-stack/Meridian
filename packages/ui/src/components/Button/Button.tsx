import type { ReactNode } from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  children?: ReactNode;
  className?: string;
}

export function Button({ children, className }: ButtonProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
