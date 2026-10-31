import { money } from '@meridian/domain';
import { Sparkline } from '@meridian/ui';
import type { MarketTick } from '@meridian/contracts';
import styles from './MarketsStrip.module.css';

export function MarketsStrip({ ticks, title, sampleLabel, isSample, numberLocale }: {
  ticks: MarketTick[]; title: string; sampleLabel: string; isSample: boolean; numberLocale: string;
}) {
  return (
    <section className={styles.root}>
      <div className={styles.head}><b className={styles.title}>{title}</b>{isSample ? <span>{sampleLabel}</span> : null}</div>
      <div className={styles.row} role="region" aria-label={title} tabIndex={0}>
        {ticks.map((t) => {
          const up = t.changePct >= 0;
          return (
            <div key={t.id} className={styles.tick}>
              <span className={styles.label}>{t.label}</span>
              <strong className={styles.value}>{money.formatNumber(t.value, t.decimals, numberLocale)}</strong>
              <em className={up ? styles.up : styles.down}>{money.formatSignedPercent(t.changePct, numberLocale)}</em>
              <Sparkline series={t.series} tone={up ? 'up' : 'down'} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
