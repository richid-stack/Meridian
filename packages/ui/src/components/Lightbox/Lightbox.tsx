import styles from './Lightbox.module.css';

export interface LightboxProps {
  children?: React.ReactNode;
  className?: string;
}

export function Lightbox({ children, className }: LightboxProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
