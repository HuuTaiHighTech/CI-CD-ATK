'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale } from '~/context/locale-context';
import { cn } from '~/lib/utils';

function ActivityTabs() {
  const { dictionary } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const onChangeTab = (id: string) => {
    if (id === tab) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', id);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false
    });
  };

  return (
    <div className='w-fit max-w-full lg:border lg:border-[#00ADFE] flex rounded-full overflow-x-auto gap-2 lg:gap-0 lg:p-2 mx-auto [&::-webkit-scrollbar]:hidden'>
      {dictionary.activities.map((item) => (
        <button
          key={item.id}
          type='button'
          onClick={() => onChangeTab(item.id)}
          className={cn(
            'text-xs md:text-sm lg:text-base font-medium lg:border-none rounded-full',
            item.id === tab
              ? 'bg-secondary-2 text-secondary'
              : 'bg-white lg:hover:bg-secondary-2 lg:bg-transparent lg:hover:text-secondary lg:text-white border border-[#00ADFE]',
            'shrink-0 cursor-pointer',
            'px-3 py-2 lg:px-6 lg:py-3'
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
export default ActivityTabs;
