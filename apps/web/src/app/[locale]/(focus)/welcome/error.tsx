'use client';

import { RouteError } from '@/components/shell/RouteError';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <RouteError reset={reset} />;
}
