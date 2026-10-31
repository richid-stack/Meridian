import Link from 'next/link';
import { Avatar } from '@meridian/ui';
import type { PersonTeaser } from '@meridian/contracts';
import styles from './PeopleRail.module.css';

export function PeopleRail({ people, locale, label }: { people: PersonTeaser[]; locale: string; label: string }) {
  return (
    <div className={styles.rail} role="region" aria-label={label} tabIndex={0}>
      {people.map((p) => (
        <Link key={p.id} href={`/${locale}/people/${p.id}`} className={styles.card}>
          <Avatar kind="person" name={p.name} size={92} fontSize={32} />
          <b className={styles.name}>{p.name}</b>
          <span className={styles.role}>{p.role}</span>
        </Link>
      ))}
    </div>
  );
}
