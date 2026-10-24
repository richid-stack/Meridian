import type { ReactNode } from 'react';
import styles from './Tabs.module.css';

export interface TabsProps {
  children?: ReactNode;
  className?: string;
}

export function Tabs({ children, className }: TabsProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
