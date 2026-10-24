'use client';

import { useState } from 'react';
import { Tabs } from '@meridian/ui';

export function DesignTabs() {
  const [v, setV] = useState('overview');
  return <Tabs label="Sections" value={v} onChange={setV} items={[{ id: 'overview', label: 'Overview' }, { id: 'timeline', label: 'Timeline' }, { id: 'books', label: 'Books' }]} />;
}
