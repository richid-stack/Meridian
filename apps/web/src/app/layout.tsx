import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono, Newsreader } from 'next/font/google';
import '../styles/reset.css';
import '../styles/globals.css';

const read = Newsreader({ subsets: ['latin'], variable: '--nf-read', display: 'swap' });
const ui = Instrument_Sans({ subsets: ['latin'], variable: '--nf-ui', display: 'swap' });
const num = JetBrains_Mono({ subsets: ['latin'], variable: '--nf-num', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F1F4F2' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0B0C' },
  ],
};

// Applies the saved theme before first paint (no flash). Wrapped in try/catch: storage can throw.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${read.variable} ${ui.variable} ${num.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
