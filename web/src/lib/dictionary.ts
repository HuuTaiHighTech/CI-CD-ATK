import 'server-only';
import { cache } from 'react';
import { i18n, type Locale } from '~/i18n';
import { isLocale } from '~/lib/locale';

const dictionaries = {
  vi: () => import('~/i18n/locales/vi.json').then((module) => module.default),
  en: () => import('~/i18n/locales/en.json').then((module) => module.default)
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['vi']>>;

export const getDictionary = cache(
  async (param: string): Promise<Dictionary> => {
    const locale: Locale = isLocale(param) ? param : i18n.default;
    return dictionaries[locale]();
  }
);
