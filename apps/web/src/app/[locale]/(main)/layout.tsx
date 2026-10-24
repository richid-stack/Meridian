import type { ReactNode } from 'react';

// Main shell: top bar, bottom nav (mobile) / sidebar (desktop), mini-player.
export default function MainLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
