import type { ReactNode } from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  children?: ReactNode;
  className?: string;
}

export function Skeleton({ children, className }: SkeletonProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
