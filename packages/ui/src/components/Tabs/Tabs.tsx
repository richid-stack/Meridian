import { cx } from '../../cx';
import styles from './Tabs.module.css';

export interface TabItem { id: string; label: string }
export interface TabsProps { items: TabItem[]; value: string; onChange: (id: string) => void; label: string }

export function Tabs({ items, value, onChange, label }: TabsProps) {
  return (
    <div role="tablist" aria-label={label} className={styles.root}>
      {items.map((t) => (
        <button key={t.id} role="tab" type="button" aria-selected={t.id === value} className={cx(styles.tab, t.id === value && styles.on)} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
