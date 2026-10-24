import type { ReactNode } from 'react';
import styles from './Switch.module.css';

export interface SwitchProps {
  children?: ReactNode;
  className?: string;
}

export function Switch({ children, className }: SwitchProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
