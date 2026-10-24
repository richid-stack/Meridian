import type { ReactNode } from 'react';
import { getMessages } from '@meridian/i18n';
import { AppShell } from '@/components/shell/AppShell';

// Main shell: bottom nav on phones, sidebar on desktop. Focus screens (invest, player...) live in (focus) with no nav.
export default async function MainLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <AppShell locale={locale} labels={getMessages(locale).nav}>
      {children}
    </AppShell>
  );
}
