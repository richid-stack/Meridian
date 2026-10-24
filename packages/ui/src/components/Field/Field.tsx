import styles from './Field.module.css';

export interface FieldProps {
  children?: React.ReactNode;
  className?: string;
}

export function Field({ children, className }: FieldProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
