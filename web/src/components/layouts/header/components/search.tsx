'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ListFilter, SearchIcon, XIcon } from 'lucide-react';
import Portal from '~/components/portal';
import { cn } from '~/lib/utils';
import { Link } from '~/components/ui';
import { useLocale } from '~/context/locale-context';
import { useDebounce } from '~/hooks';
import { searchService } from '~/services';
import { Search } from '~/types';

function SearchBox() {
  const { dictionary } = useLocale();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenFilter, setOpenFilter] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [filter, setFilter] = useState<string | null>(null);
  const [results, setResults] = useState<Search[]>([]);
  const [isLoading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(keyword.trim(), 300);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpenFilter &&
        filterRef.current &&
        !filterRef.current.contains(e.target as Node)
      ) {
        setOpenFilter(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenFilter]);

  const fetchSearch = useCallback(
    async (search: string, type: string | null) => {
      try {
        setLoading(true);
        const { items } = await searchService.get({
          q: search,
          type: type ?? undefined,
          cursor: undefined,
          limit: 10
        });
        setResults(items);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    fetchSearch(debouncedSearch, filter);
  }, [fetchSearch, debouncedSearch, filter]);

  const handleSelectFilter = useCallback((value: string | null) => {
    setFilter(value);
    setOpenFilter(false);
  }, []);

  const handleClearKeyword = useCallback(() => {
    setKeyword('');
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <button
        type='button'
        className='inline-flex justify-center items-center text-white cursor-pointer hover:text-secondary outline-none'
        onClick={() => setOpen(true)}
      >
        <SearchIcon className='size-4 md:size-5 shrink-0' />
      </button>
      {isOpen && (
        <Portal>
          <>
            <div
              className='fixed inset-0 size-full bg-black/50 overflow-hidden z-20'
              role='presentation'
              aria-hidden='true'
              onClick={() => setOpen(false)}
            />
            <div
              className={cn(
                'fixed top-[10%] md:top-[15%] left-1/2 w-3xl max-w-[90%] max-h-4/5',
                'flex flex-col bg-white rounded-xl',
                'transition-all -translate-x-1/2 z-20'
              )}
              role='dialog'
              aria-modal='true'
              aria-labelledby='search-modal-title'
            >
              <div className='flex items-center gap-3 px-3 lg:px-4'>
                <SearchIcon className='size-4 md:size-5 lg:size-6 text-neutral-500 shrink-0 pointer-events-none' />
                <input
                  id='search'
                  name='search'
                  type='text'
                  ref={inputRef}
                  className='flex-1 text-neutral-800 text-sm md:text-base lg:text-lg font-medium outline-none py-3 lg:py-5'
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={dictionary.search.text}
                />
                {keyword && (
                  <button
                    type='button'
                    className='inline-flex justify-center items-center text-neutral-500 hover:text-neutral-800'
                  >
                    <XIcon
                      onClick={handleClearKeyword}
                      className='size-4 md:size-5 lg:size-6 shrink-0 cursor-pointer'
                      strokeWidth={2.5}
                    />
                  </button>
                )}
                <div className='h-7 w-px bg-neutral-300 shrink-0' />
                <div className='relative' ref={filterRef}>
                  <button
                    type='button'
                    className='inline-flex justify-center items-center text-sm md:text-base lg:text-lg font-semibold cursor-pointer select-none gap-2'
                    onClick={() => setOpenFilter((o) => !o)}
                  >
                    {dictionary.search.filter}{' '}
                    <ListFilter className='size-3 md:size-4 lg:size-5 shrink-0' />
                  </button>
                  {isOpenFilter && (
                    <ul className='absolute left-1/2 top-full w-max bg-white rounded-xl shadow -translate-x-1/2 overflow-hidden mt-3'>
                      <li className='text-xs lg:text-sm text-neutral-400 font-medium px-3 py-2 md:px-4 md:py-3'>
                        {dictionary.search.filter_title}
                      </li>
                      {dictionary.search.filter_options.map((item) => (
                        <li
                          key={item.value ?? 'all'}
                          className={cn(
                            'text-xs lg:text-sm font-medium',
                            filter === item.value
                              ? 'bg-secondary-2 text-white'
                              : 'hover:bg-neutral-200',
                            'cursor-pointer px-3 py-2 md:px-4 md:py-3'
                          )}
                          onClick={() => handleSelectFilter(item.value)}
                        >
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  'grid border-t border-neutral-300',
                  debouncedSearch
                    ? 'max-h-full visible grid-rows-[1fr]'
                    : 'h-0 invisible grid-rows-[0fr]',
                  'transition-all duration-150 overflow-hidden'
                )}
              >
                <ul className='min-h-0 space-y-3 lg:space-y-4 overflow-y-auto p-3 lg:p-4'>
                  {!isLoading && results.length === 0 && (
                    <li className='text-center text-neutral-500 py-4'>
                      {dictionary.search.empty}
                    </li>
                  )}
                  {!isLoading &&
                    results.map((item) => (
                      <li
                        key={item.id}
                        className='text-sm sm:text-base md:text-lg lg:text-xl font-medium text-neutral-400 hover:text-neutral-800'
                      >
                        <Link
                          href={
                            item.type === 'product'
                              ? `/products/${item.slug}`
                              : `/posts/${item.slug}`
                          }
                          onClick={() => setOpen(false)}
                          className='flex items-center gap-2 lg:gap-3'
                        >
                          <SearchIcon className='size-4 md:size-5 lg:size-6 shrink-0' />{' '}
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </>
        </Portal>
      )}
    </>
  );
}

export default SearchBox;
