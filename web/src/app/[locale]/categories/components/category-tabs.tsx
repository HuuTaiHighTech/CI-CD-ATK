'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Category } from '~/types';
import { cn } from '~/lib/utils';

type Props = {
  categories: Category[];
};

function CategoryTabs({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const onChangeTab = (slug: string) => {
    if (slug === tab) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', slug);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false
    });
  };

  return (
    <div className='w-full lg:bg-primary flex lg:rounded-full pb-5 lg:p-3 mx-auto gap-3 lg:gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
      {categories.map((item) => (
        <button
          key={item.id}
          type='button'
          onClick={() => onChangeTab(item.slug)}
          className={cn(
            'lg:flex-1 text-xs md:text-sm lg:text-base border border-[#00ADFE] lg:border-transparent lg:font-semibold rounded-full cursor-pointer shrink-0 px-2 py-1 md:px-3 md:py-2',
            item.slug === tab
              ? 'bg-secondary-2 text-secondary'
              : 'bg-white lg:bg-transparent text-[#252526] lg:text-white lg:hover:bg-secondary-2 lg:hover:text-secondary'
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
