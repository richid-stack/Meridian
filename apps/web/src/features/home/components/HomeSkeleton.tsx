import { Skeleton } from '@meridian/ui';

export function HomeSkeleton() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '26px var(--margin) 0' }} aria-busy="true">
      <Skeleton width={160} height={14} />
      <div style={{ margin: '14px 0 18px' }}><Skeleton width="70%" height={44} /></div>
      <Skeleton height={48} />
      <div style={{ margin: '22px 0' }}><Skeleton height={120} /></div>
      <Skeleton width="90%" height={40} />
      <div style={{ margin: '12px 0' }}><Skeleton width="60%" height={40} /></div>
      <Skeleton height={14} /><div style={{ margin: '8px 0' }}><Skeleton width="80%" height={14} /></div>
    </div>
  );
}
