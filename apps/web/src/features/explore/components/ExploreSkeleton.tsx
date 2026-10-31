import { Skeleton } from '@meridian/ui';

export function ExploreSkeleton() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '26px var(--margin) 0' }} aria-busy="true">
      <Skeleton width="50%" height={44} />
      <div style={{ margin: '16px 0 28px' }}><Skeleton height={48} /></div>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ padding: '14px 0', borderTop: '1px solid var(--rule)' }}><Skeleton width="65%" height={18} /><div style={{ marginTop: 8 }}><Skeleton width="45%" height={12} /></div></div>)}
    </div>
  );
}
