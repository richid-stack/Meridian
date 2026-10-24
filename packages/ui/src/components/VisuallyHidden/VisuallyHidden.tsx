import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps {
  children?: React.ReactNode;
  className?: string;
}

export function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
