import { i18n, type Locale } from '~/i18n';

export function isLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}

export async function getLocaleServer(): Promise<Locale> {
  const { headers } = await import('next/headers');
  const h = await headers();
  const lang = h.get('x-locale');
  if (!lang) return i18n.default;
  return isLocale(lang) ? lang : i18n.default;
}

export function getLocaleClient(): Locale {
  if (typeof window === 'undefined') return i18n.default;

  const segments = window.location.pathname.split('/');
  const lang = segments[1];

  return isLocale(lang) ? lang : i18n.default;
}

export function getLocale(): Locale | Promise<Locale> {
  if (typeof window === 'undefined') {
    return getLocaleServer();
  }
  return getLocaleClient();
}
