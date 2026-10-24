import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({ children, className }: EmptyStateProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
