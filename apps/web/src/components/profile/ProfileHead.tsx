import { Avatar } from '@meridian/ui';
import styles from './Profile.module.css';

export function ProfileHead({ kind, name, initials, lines }: { kind: 'person' | 'company'; name: string; initials: string; lines: string[] }) {
  return (
    <div className={styles.head}>
      {kind === 'person'
        ? <Avatar kind="person" name={name} size={88} fontSize={40} />
        : <span className={styles.logo} role="img" aria-label={name}><span aria-hidden="true">{initials}</span></span>}
      <div className={styles.headText}>
        <h1 className={styles.h1}>{name}</h1>
        <p className={styles.role}>{lines.map((l, i) => <span key={i}>{l}{i < lines.length - 1 ? <br /> : null}</span>)}</p>
      </div>
    </div>
  );
}
