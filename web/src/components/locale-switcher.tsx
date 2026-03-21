'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { i18n } from '~/i18n';
import { useLocale } from '~/context/locale-context';

function LocaleSwitcher() {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;

    if (nextLocale === locale) return;

    const [, ...segments] = pathname.split('/').filter(Boolean);
    const path = segments.join('/');
    const query = searchParams.toString();
    router.push(`/${nextLocale}/${path}?${query}`, {
      scroll: false
    });
  };

  return (
    <div className='flex justify-center items-center bg-white/10 lg:bg-transparent rounded-md lg:rounded-b-none p-1.5 lg:py-0'>
      <select
        id='locale'
        name='locale'
        className='text-xs lg:text-sm 2xl:text-base font-medium lg:font-semibold text-secondary outline-none cursor-pointer'
        value={locale}
        onChange={handleChange}
      >
        {i18n.locales.map((item) => (
          <option key={item} value={item} className='text-black'>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LocaleSwitcher;
