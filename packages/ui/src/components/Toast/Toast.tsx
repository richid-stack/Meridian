import type { ReactNode } from 'react';
import styles from './Toast.module.css';

export interface ToastProps {
  children?: ReactNode;
  className?: string;
}

export function Toast({ children, className }: ToastProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
