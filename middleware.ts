import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LANGS = ['nl', 'en', 'fr'] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

function getLangFromPathname(pathname: string): SupportedLang | null {
  const seg = pathname.split('/')[1];
  if (!seg) return null;
  return (SUPPORTED_LANGS as readonly string[]).includes(seg) ? (seg as SupportedLang) : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next internals, API routes, and static files
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/favicon') ||
    pathname.includes('.')  // Skip any file with extension
  ) {
    return NextResponse.next();
  }

  // Redirect root to default locale
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/nl';
    return NextResponse.redirect(url);
  }

  // Normalize legacy non-localized pages to default locale
  if (pathname === '/about' || pathname === '/gallery') {
    const url = request.nextUrl.clone();
    url.pathname = `/nl${pathname}`;
    return NextResponse.redirect(url);
  }

  const lang = getLangFromPathname(pathname) ?? 'nl';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', lang);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};


