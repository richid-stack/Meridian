import { Skeleton } from '@meridian/ui';

export default function Loading() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '84px var(--margin) 0' }} aria-busy="true">
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <Skeleton width={88} height={108} />
        <div style={{ flex: 1, display: 'grid', gap: 10 }}><Skeleton width="70%" height={34} /><Skeleton width="50%" height={14} /></div>
      </div>
      <div style={{ marginTop: 28 }}><Skeleton height={190} /></div>
    </div>
  );
}
