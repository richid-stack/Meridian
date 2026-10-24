import type { ComponentType, ReactNode } from 'react';

export interface NavItem { id: string; label: string; href: string }

export interface NavLinkProps {
  href: string;
  className?: string;
  'aria-current'?: 'page';
  children: ReactNode;
}
/** The app passes next/link here; the library never imports Next. */
export type NavLink = ComponentType<NavLinkProps>;

export function DefaultLink({ children, ...p }: NavLinkProps) {
  return <a {...p}>{children}</a>;
}
