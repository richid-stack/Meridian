import type { ReactNode } from 'react';
import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  children?: ReactNode;
  className?: string;
}

export function ErrorState({ children, className }: ErrorStateProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
