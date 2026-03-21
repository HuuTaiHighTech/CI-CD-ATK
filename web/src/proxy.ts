import { type NextRequest, NextResponse } from 'next/server';
import { i18n } from '~/i18n';
import { isLocale } from '~/lib/locale';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);

  if (!isLocale(segments[0])) {
    const url = new URL(`/${i18n.default}${pathname}`, request.url);
    const response = NextResponse.redirect(url, 307);
    response.headers.set('x-locale', i18n.default);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('x-locale', segments[0]);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|woff|woff2|ttf|eot)).*)'
  ]
};
