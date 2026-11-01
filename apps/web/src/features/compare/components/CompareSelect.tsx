'use client';

import { useRouter } from 'next/navigation';
import { deals } from '@meridian/domain';
import { Pill } from '@meridian/ui';
import { compareHref } from '@/lib/capital';
import styles from './Compare.module.css';

interface Props { locale: string; options: { id: string; name: string }[]; a: string; b: string; t: Record<string, string> }

/** Pick a round for each side. Choosing the one on the other side swaps them, so the two are never the same. */
export function CompareSelect({ locale, options, a, b, t }: Props) {
  const router = useRouter();
  const pick = (side: 'a' | 'b', id: string) => {
    const next = deals.selectRound({ a, b }, side, id);
    router.push(compareHref(locale, next.a, next.b), { scroll: false });
  };
  return (
    <>
      {(['a', 'b'] as const).map((side) => (
        <div className={styles.pick} key={side}>
          <h2 id={`pick-${side}`}>{side === 'a' ? t.roundA : t.roundB}</h2>
          <div className={styles.chips} role="group" aria-labelledby={`pick-${side}`}>
            {options.map((o) => <Pill key={o.id} selected={(side === 'a' ? a : b) === o.id} onClick={() => pick(side, o.id)}>{o.name}</Pill>)}
          </div>
        </div>
      ))}
    </>
  );
}
