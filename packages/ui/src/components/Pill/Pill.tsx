import styles from './Pill.module.css';

export interface PillProps {
  children?: React.ReactNode;
  className?: string;
}

export function Pill({ children, className }: PillProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
