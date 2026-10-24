import type { ReactNode } from 'react';
import styles from './TopBar.module.css';

export interface TopBarProps {
  children?: ReactNode;
  className?: string;
}

export function TopBar({ children, className }: TopBarProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
