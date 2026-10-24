import type { ReactNode } from 'react';
import styles from './OfflineBanner.module.css';

export interface OfflineBannerProps {
  children?: ReactNode;
  className?: string;
}

export function OfflineBanner({ children, className }: OfflineBannerProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
