import styles from './SourceLabel.module.css';

export function SourceLabel({ label, source, href }: { label: string; source: string; href?: string }) {
  return (
    <span className={styles.root}>
      {label}{' '}
      {href ? <a href={href} className={styles.link} rel="noopener noreferrer">{source}</a> : source}
    </span>
  );
}
