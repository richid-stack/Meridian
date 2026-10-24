import type { ReactNode } from 'react';
import styles from './Sheet.module.css';

export interface SheetProps {
  children?: ReactNode;
  className?: string;
}

export function Sheet({ children, className }: SheetProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
