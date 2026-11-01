import { Skeleton } from '@meridian/ui';

/** Shown while a rounds page loads. Same shape as the list so nothing jumps. */
export function CapitalSkeleton() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '84px var(--margin) 0', display: 'grid', gap: 22 }} aria-busy="true">
      <Skeleton width="50%" height={30} />
      <Skeleton height={64} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Skeleton width={44} height={44} />
          <div style={{ flex: 1, display: 'grid', gap: 8 }}><Skeleton width="45%" height={18} /><Skeleton width="70%" height={14} /></div>
        </div>
      ))}
    </div>
  );
}
