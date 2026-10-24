import type { ReactNode } from 'react';
import styles from './Rule.module.css';

export interface RuleProps {
  children?: ReactNode;
  className?: string;
}

export function Rule({ children, className }: RuleProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
