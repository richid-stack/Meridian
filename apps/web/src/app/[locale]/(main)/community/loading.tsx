import { Skeleton } from '@meridian/ui';

export default function Loading() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '84px var(--margin) 0', display: 'grid', gap: 22 }} aria-busy="true">
      <Skeleton width="60%" height={20} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 14 }}>
          <Skeleton width={44} height={54} />
          <div style={{ flex: 1, display: 'grid', gap: 8 }}><Skeleton width="40%" height={14} /><Skeleton height={18} /><Skeleton width="80%" height={18} /></div>
        </div>
      ))}
    </div>
  );
}
