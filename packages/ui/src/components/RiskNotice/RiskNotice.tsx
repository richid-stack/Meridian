import styles from './RiskNotice.module.css';

export interface RiskNoticeProps {
  children?: React.ReactNode;
  className?: string;
}

export function RiskNotice({ children, className }: RiskNoticeProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}
