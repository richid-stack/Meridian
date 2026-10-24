import type { ReactNode } from 'react';

const paths: Record<string, ReactNode> = {
  home: <path d="M4 11l8-7 8 7v9H4z" />,
  explore: (<><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>),
  community: <path d="M4 5h16v11H9l-5 4z" />,
  capital: <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />,
  you: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></>),
};

export type NavIconName = keyof typeof paths;

export function NavIcon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
