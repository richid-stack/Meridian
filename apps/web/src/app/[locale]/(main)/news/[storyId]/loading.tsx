import { Skeleton } from '@meridian/ui';

export default function Loading() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '84px var(--margin) 0', display: 'grid', gap: 14 }} aria-busy="true">
      <Skeleton width="40%" height={12} />
      <Skeleton height={40} />
      <Skeleton width="75%" height={40} />
      <Skeleton height={120} />
    </div>
  );
}
