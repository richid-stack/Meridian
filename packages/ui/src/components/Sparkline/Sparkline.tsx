import styles from './Sparkline.module.css';

export interface SparklineProps {
  children?: React.ReactNode;
  className?: string;
}

export function Sparkline({ children, className }: SparklineProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
