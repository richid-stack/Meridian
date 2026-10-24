import styles from './Illustration.module.css';

export interface IllustrationProps {
  children?: React.ReactNode;
  className?: string;
}

export function Illustration({ children, className }: IllustrationProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
