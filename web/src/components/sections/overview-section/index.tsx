'use client';

import { useMemo } from 'react';
import { useLocale } from '~/context/locale-context';
import { i18n } from '~/i18n';

type Props = {
  images: string[];
};

function OverviewSection({ images }: Props) {
  const { locale } = useLocale();

  const current = useMemo(() => {
    if (!images.length) return [];

    const localeIndex = i18n.locales.indexOf(locale);
    if (localeIndex === -1) return [];

    const perLocale = Math.floor(images.length / i18n.locales.length);

    const start = localeIndex * perLocale;
    const end = start + perLocale;

    return images.slice(start, end);
  }, [locale, images]);

  return current.map((item, index) => (
    <img
      key={index}
      src={item}
      alt={`Overview ${index + 1}`}
      className='w-full object-contain'
    />
  ));
}

export default OverviewSection;
