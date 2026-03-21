'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '~/context/locale-context';
import { cn } from '~/lib/utils';

type Props = {
  page: number;
  totalPages: number;
  scrollToTop?: boolean;
  offset?: number;
  varian?: 'dark' | 'light';
};

function Pagination({
  page,
  totalPages,
  scrollToTop = false,
  offset = 0,
  varian = 'dark'
}: Props) {
  const { dictionary } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!scrollToTop) return;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }, [scrollToTop, offset, page]);

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center lg:justify-start gap-3'>
      <button
        type='button'
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className={cn(
          'inline-flex justify-center items-center',
          'text-sm lg:text-base font-semibold',
          varian === 'dark' && 'text-white',
          varian === 'light' && 'text-neutral-900',
          'border-[1.4px] border-[#00ADFE] rounded-sm cursor-pointer',
          'disabled:border-[#cccccc] disabled:cursor-not-allowed',
          'gap-1 px-3 py-2'
        )}
      >
        <ChevronLeft className='size-5 lg:size-6 shrink-0' /> {dictionary.prev}
      </button>
      <button
        type='button'
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className={cn(
          'inline-flex justify-center items-center',
          'text-sm lg:text-base font-semibold',
          varian === 'dark' && 'text-white',
          varian === 'light' && 'text-neutral-900',
          'border-[1.4px] border-[#00ADFE] rounded-sm cursor-pointer',
          'disabled:border-[#cccccc] disabled:cursor-not-allowed',
          'gap-1 px-3 py-2'
        )}
      >
        {dictionary.next} <ChevronRight className='size-5 lg:size-6 shrink-0' />
      </button>
    </div>
  );
}

export default Pagination;
