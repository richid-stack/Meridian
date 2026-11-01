'use client';

import { useEffect, useState } from 'react';
import type { Post } from '@meridian/contracts';
import { PostCard } from '@/components/community/PostCard';
import { SAMPLE_MODE } from '@/lib/sample';
import { readSample } from '@/lib/sampleStore';

/** Sample mode: the person's own posts, saved in this browser. With a backend they come from the feed itself. */
export function YourPosts({ locale, nl, t, groupId }: { locale: string; nl: string; t: Record<string, string>; groupId?: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!SAMPLE_MODE) return;
    setPosts(readSample().posts.filter((p) => (groupId ? p.groupId === groupId : !p.groupId)).map((p) => p.post));
    setNow(Date.now());
  }, [groupId]);
  if (posts.length === 0) return null;
  return <>{posts.map((p) => <PostCard key={p.id} post={p} locale={locale} now={now} nl={nl} t={t} />)}</>;
}
