import type { ReactNode } from 'react';
import styles from './AiLabel.module.css';

export interface AiLabelProps {
  children?: ReactNode;
  className?: string;
}

export function AiLabel({ children, className }: AiLabelProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
