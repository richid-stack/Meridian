import { cx } from '../../cx';
import styles from './Avatar.module.css';

export interface AvatarProps {
  /** person = 44x54 portrait (radius 4), company = rounded square, round = podcast/user */
  kind: 'person' | 'company' | 'round';
  name: string;
  size?: number;
  fontSize?: number;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return (parts[0] ?? '').slice(0, 1).toUpperCase();
  return ((parts[0] ?? '')[0] ?? '').toUpperCase() + ((parts[parts.length - 1] ?? '')[0] ?? '').toUpperCase();
}

export function Avatar({ kind, name, size, fontSize }: AvatarProps) {
  const text = kind === 'company' ? initials(name).slice(0, 1) : initials(name);
  return (
    <span className={cx(styles.root, styles[kind])} style={size ? { width: size, height: kind === 'person' ? Math.round(size * 1.217) : size, ...(fontSize ? { fontSize } : {}) } : undefined} role="img" aria-label={name}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
