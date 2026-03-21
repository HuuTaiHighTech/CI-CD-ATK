'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '~/context/locale-context';
import type { Category } from '~/types';
import { cn } from '~/lib/utils';

type Props = {
  categories: Category[];
};

function FilterPost({ categories }: Props) {
  const { dictionary } = useLocale();
  const [isOpen, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const onChangeCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === category) {
      params.delete('category');
    } else {
      params.set('category', slug);
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false
    });
  };

  return (
    <div className='space-y-3'>
      <button
        type='button'
        className='inline-flex justify-center items-center text-sm text-white bg-secondary-2 rounded-full cursor-pointer p-3 gap-1'
        onClick={() => setOpen((o) => !o)}
      >
        {dictionary.filter_by_product}
        <ChevronDown
          size={17}
          className={`${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>
      {isOpen && (
        <div className='bg-blue-50 rounded-xl space-y-3 p-5'>
          <h3 className='text-base md:text-xl lg:text-2xl font-semibold text-neutral-900'>
            {dictionary.hot_keywords}
          </h3>
          <div className='flex flex-wrap gap-4'>
            {categories.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => onChangeCategory(item.slug)}
                className={cn(
                  'rounded-full border-[1.4px] text-xs md:text-sm lg:text-base px-3 py-2',
                  item.slug === category
                    ? 'bg-primary text-secondary border-primary'
                    : 'border-[#00ADFE] text-[#252526] bg-white hover:bg-primary hover:text-secondary hover:border-primary'
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default FilterPost;
