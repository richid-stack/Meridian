import type { ReactNode } from 'react';
import styles from './Lightbox.module.css';

export interface LightboxProps {
  children?: ReactNode;
  className?: string;
}

export function Lightbox({ children, className }: LightboxProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
