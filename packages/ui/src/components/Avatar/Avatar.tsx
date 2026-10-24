import styles from './Avatar.module.css';

export interface AvatarProps {
  children?: React.ReactNode;
  className?: string;
}

export function Avatar({ children, className }: AvatarProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
