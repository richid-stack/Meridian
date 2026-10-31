'use client';

import { useState } from 'react';
import { Button } from '@meridian/ui';

/** Local state only. Saving follows needs sign-in, which arrives with the auth module. */
export function FollowButton({ follow, following }: { follow: string; following: string }) {
  const [on, setOn] = useState(false);
  return (
    <Button variant={on ? 'outline' : 'primary'} aria-pressed={on} onClick={() => setOn((v) => !v)}>
      {on ? following : follow}
    </Button>
  );
}
