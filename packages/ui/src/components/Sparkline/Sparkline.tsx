import type { ReactNode } from 'react';
import styles from './Sparkline.module.css';

export interface SparklineProps {
  children?: ReactNode;
  className?: string;
}

export function Sparkline({ children, className }: SparklineProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
