import { cx } from '../../cx';
import { NavIcon } from '../../icons/nav';
import { DefaultLink, type NavItem, type NavLink } from '../nav-types';
import styles from './BottomNav.module.css';

export interface BottomNavProps {
  items: NavItem[];
  current: string;
  label: string;
  Link?: NavLink;
}

export function BottomNav({ items, current, label, Link = DefaultLink }: BottomNavProps) {
  return (
    <nav className={styles.root} aria-label={label}>
      <div className={styles.row}>
        {items.map((it) => (
          <Link key={it.id} href={it.href} className={cx(styles.item, it.id === current && styles.on)} aria-current={it.id === current ? 'page' : undefined}>
            <NavIcon name={it.id} />
            {it.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
