import styles from './BottomNav.module.css';

export interface BottomNavProps {
  children?: React.ReactNode;
  className?: string;
}

export function BottomNav({ children, className }: BottomNavProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
