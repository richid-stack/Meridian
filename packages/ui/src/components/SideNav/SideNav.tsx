import { cx } from '../../cx';
import { NavIcon } from '../../icons/nav';
import { DefaultLink, type NavItem, type NavLink } from '../nav-types';
import styles from './SideNav.module.css';

export interface SideNavProps {
  items: NavItem[];
  current: string;
  label: string;
  Link?: NavLink;
}

/** Desktop navigation: same five destinations as the bottom bar. */
export function SideNav({ items, current, label, Link = DefaultLink }: SideNavProps) {
  return (
    <nav className={styles.root} aria-label={label}>
      <span className={styles.logo}>Meridian<i /></span>
      {items.map((it) => (
        <Link key={it.id} href={it.href} className={cx(styles.item, it.id === current && styles.on)} aria-current={it.id === current ? 'page' : undefined}>
          <NavIcon name={it.id} />
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
