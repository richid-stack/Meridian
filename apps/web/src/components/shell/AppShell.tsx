'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { BottomNav, SideNav, type NavItem } from '@meridian/ui';
import styles from './AppShell.module.css';

export interface AppShellProps {
  locale: string;
  labels: { home: string; explore: string; community: string; capital: string; you: string; main: string };
  children: ReactNode;
}

const ROUTES = { home: '', explore: '/explore', community: '/community', capital: '/capital', you: '/you' } as const;

/** Which of the five tabs a path belongs to. News, articles and people live under Today and Explore. */
export function currentTab(pathname: string, locale: string): string {
  const rest = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
  if (rest.startsWith('/explore') || rest.startsWith('/people') || rest.startsWith('/companies') || rest.startsWith('/compare')) return 'explore';
  if (rest.startsWith('/community') || rest.startsWith('/groups') || rest.startsWith('/messages') || rest.startsWith('/compose')) return 'community';
  if (rest.startsWith('/capital') || rest.startsWith('/portfolio') || rest.startsWith('/watchlist')) return 'capital';
  if (rest.startsWith('/you') || rest.startsWith('/notifications')) return 'you';
  return 'home';
}

export function AppShell({ locale, labels, children }: AppShellProps) {
  const pathname = usePathname();
  const current = currentTab(pathname, locale);
  const items: NavItem[] = (Object.keys(ROUTES) as (keyof typeof ROUTES)[]).map((id) => ({
    id,
    label: labels[id],
    href: `/${locale}${ROUTES[id]}`,
  }));
  return (
    <div className={styles.root}>
      <aside className={styles.side}>
        <SideNav items={items} current={current} label={labels.main} Link={Link} />
      </aside>
      <div className={styles.main}>{children}</div>
      <div className={styles.bottom}>
        <BottomNav items={items} current={current} label={labels.main} Link={Link} />
      </div>
    </div>
  );
}
