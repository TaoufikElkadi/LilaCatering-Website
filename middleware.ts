import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LANGS = ['nl', 'en', 'fr'] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

function getLangFromPathname(pathname: string): SupportedLang | null {
  const seg = pathname.split('/')[1];
  if (!seg) return null;
  return (SUPPORTED_LANGS as readonly string[]).includes(seg) ? (seg as SupportedLang) : null;
}

// "Under construction" gate. Enabled unless SITE_COMING_SOON is explicitly
// 'false'. The public sees /coming-soon; visiting `?preview=<token>` once
// unlocks the real site via a cookie so the team can keep testing.
const COMING_SOON = process.env.SITE_COMING_SOON !== 'false';
const PREVIEW_TOKEN = process.env.SITE_PREVIEW_TOKEN || '';
const PREVIEW_COOKIE = 'lila-preview';

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

  // ── Under-construction gate ───────────────────────────────────────────
  if (COMING_SOON) {
    const unlocked =
      !!PREVIEW_TOKEN && request.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_TOKEN;

    // Unlock via ?preview=<token>: set cookie, then redirect to a clean URL.
    const previewParam = request.nextUrl.searchParams.get('preview');
    if (PREVIEW_TOKEN && previewParam === PREVIEW_TOKEN) {
      const url = request.nextUrl.clone();
      url.searchParams.delete('preview');
      const res = NextResponse.redirect(url);
      res.cookies.set(PREVIEW_COOKIE, PREVIEW_TOKEN, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return res;
    }

    if (!unlocked) {
      // Show the coming-soon page for everything (signal layout to hide chrome).
      const headers = new Headers(request.headers);
      headers.set('x-coming-soon', '1');
      if (pathname === '/coming-soon') {
        return NextResponse.next({ request: { headers } });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/coming-soon';
      return NextResponse.rewrite(url, { request: { headers } });
    }

    // Unlocked but visiting /coming-soon directly → send to the real home.
    if (pathname === '/coming-soon') {
      const url = request.nextUrl.clone();
      url.pathname = '/nl';
      return NextResponse.redirect(url);
    }
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


