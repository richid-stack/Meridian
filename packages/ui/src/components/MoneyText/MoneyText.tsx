import styles from './MoneyText.module.css';

export interface MoneyTextProps {
  children?: React.ReactNode;
  className?: string;
}

export function MoneyText({ children, className }: MoneyTextProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
