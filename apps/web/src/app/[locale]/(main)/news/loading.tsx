import { Skeleton } from '@meridian/ui';

export default function Loading() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '84px var(--margin) 0', display: 'grid', gap: 18 }} aria-busy="true">
      <Skeleton width="55%" height={40} />
      {[0, 1, 2, 3].map((i) => (<div key={i} style={{ display: 'grid', gap: 8 }}><Skeleton width="40%" height={12} /><Skeleton height={22} /><Skeleton width="80%" height={22} /></div>))}
    </div>
  );
}
