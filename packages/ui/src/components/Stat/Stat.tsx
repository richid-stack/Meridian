import styles from './Stat.module.css';

export interface StatProps {
  children?: React.ReactNode;
  className?: string;
}

export function Stat({ children, className }: StatProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
