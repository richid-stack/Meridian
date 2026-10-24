import styles from './IconButton.module.css';

export interface IconButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function IconButton({ children, className }: IconButtonProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
