import styles from './Skeleton.module.css';
export function Skeleton({ width = '100%', height = 14 }: { width?: number | string; height?: number | string }) {
  return <span className={styles.root} style={{ width, height }} aria-hidden="true" />;
}
