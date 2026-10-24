import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  children?: React.ReactNode;
  className?: string;
}

export function ErrorState({ children, className }: ErrorStateProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
