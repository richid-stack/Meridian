import styles from './AiLabel.module.css';

export interface AiLabelProps {
  children?: React.ReactNode;
  className?: string;
}

export function AiLabel({ children, className }: AiLabelProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
