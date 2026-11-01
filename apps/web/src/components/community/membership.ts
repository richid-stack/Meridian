import type { MembershipResult } from '@meridian/contracts';
import { api } from '@/lib/api';
import { SAMPLE_MODE } from '@/lib/sample';
import { updateSample } from '@/lib/sampleStore';

/** Join or leave a group. In sample mode the change is also saved in this browser. */
export async function changeMembership(groupId: string, joined: boolean): Promise<MembershipResult> {
  const r = await api.groups.setMembership(groupId, joined);
  if (SAMPLE_MODE) updateSample((s) => ({ ...s, groups: { ...s.groups, [groupId]: r.joined } }));
  return r;
}
