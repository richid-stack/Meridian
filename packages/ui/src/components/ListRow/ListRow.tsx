import styles from './ListRow.module.css';

export interface ListRowProps {
  children?: React.ReactNode;
  className?: string;
}

export function ListRow({ children, className }: ListRowProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
