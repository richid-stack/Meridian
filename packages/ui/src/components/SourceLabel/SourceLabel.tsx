import styles from './SourceLabel.module.css';

export interface SourceLabelProps {
  children?: React.ReactNode;
  className?: string;
}

export function SourceLabel({ children, className }: SourceLabelProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
