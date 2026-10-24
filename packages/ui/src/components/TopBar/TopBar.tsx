import styles from './TopBar.module.css';

export interface TopBarProps {
  children?: React.ReactNode;
  className?: string;
}

export function TopBar({ children, className }: TopBarProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
