'use client';

import { createContext, useContext, useMemo } from 'react';
import type { Dictionary } from '~/lib/dictionary';
import type { Locale } from '~/i18n';

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function LocaleProvider({
  locale,
  dictionary,
  children
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, dictionary }), [locale, dictionary]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export default LocaleProvider;

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return ctx;
}
