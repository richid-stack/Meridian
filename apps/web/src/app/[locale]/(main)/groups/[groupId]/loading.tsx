import { Skeleton } from '@meridian/ui';

export default function Loading() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '84px var(--margin) 0', display: 'grid', gap: 14 }} aria-busy="true">
      <Skeleton width="70%" height={36} /><Skeleton width="50%" height={14} /><Skeleton width={120} height={44} /><Skeleton height={80} />
    </div>
  );
}
