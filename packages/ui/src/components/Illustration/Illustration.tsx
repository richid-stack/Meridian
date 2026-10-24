import type { ReactNode } from 'react';
import styles from './Illustration.module.css';

export interface IllustrationProps {
  children?: ReactNode;
  className?: string;
}

export function Illustration({ children, className }: IllustrationProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
