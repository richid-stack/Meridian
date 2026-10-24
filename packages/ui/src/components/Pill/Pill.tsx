import type { ReactNode } from 'react';
import styles from './Pill.module.css';

export interface PillProps {
  children?: ReactNode;
  className?: string;
}

export function Pill({ children, className }: PillProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
