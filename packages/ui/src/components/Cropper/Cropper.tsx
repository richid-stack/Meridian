import styles from './Cropper.module.css';

export interface CropperProps {
  children?: React.ReactNode;
  className?: string;
}

export function Cropper({ children, className }: CropperProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
