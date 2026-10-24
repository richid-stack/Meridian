import { NextResponse, type NextRequest } from 'next/server';

const locales = ['en', 'fr'] as const;
const defaultLocale = 'en';

function pickLocale(req: NextRequest): string {
  const header = req.headers.get('accept-language') ?? '';
  const first = header.split(',')[0]?.trim().slice(0, 2).toLowerCase();
  return (locales as readonly string[]).includes(first ?? '') ? (first as string) : defaultLocale;
}

/** Every page lives under /{locale}. Visiting "/" or "/news" redirects to "/en" or "/en/news" (or fr). */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
