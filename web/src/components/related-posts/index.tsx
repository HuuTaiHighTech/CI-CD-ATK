'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays } from 'lucide-react';
import { postService } from '~/services';
import { useLocale } from '~/context/locale-context';
import { Link } from '~/components/ui';
import { formatDate } from '~/lib/date';
import type { PostSummary } from '~/types';

function RelatedPosts() {
  const { locale, dictionary } = useLocale();
  const [posts, setPosts] = useState<PostSummary[]>();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    const init = async () => {
      const { items } = await postService.get({
        limit: 4,
        ...(tab && { relate: [tab] })
      });
      setPosts(items);
    };

    init();
  }, [tab]);

  return (
    <div className='col-span-4 hidden lg:block'>
      <div className='rounded-t-2xl bg-secondary-2 py-4'>
        <h3 className='text-2xl font-semibold text-white text-center'>
          {dictionary.related_posts}
        </h3>
      </div>
      <div className='border-2 border-blue-400 rounded-b-2xl p-3 2xl:px-4 2xl:py-5 space-y-3 2xl:space-y-5'>
        {posts?.map((item) => (
          <Link
            key={item.id}
            href={`/posts/${item.slug}`}
            className='group flex gap-3'
          >
            <div className='relative w-32 xl:w-36 aspect-3/2 rounded-md shrink-0 overflow-hidden'>
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes='(min-width: 1280px) 144px, 128px'
                className='object-cover'
              />
            </div>
            <div className='space-y-1'>
              <div className='flex items-center gap-1'>
                <CalendarDays size={17} className='text-[#2D80BD]' />
                <span className='text-xs xl:text-sm text-neutral-300'>
                  {formatDate(item.createdAt, locale)}
                </span>
              </div>
              <h5 className='text-sm xl:text-base font-medium text-white group-hover:text-accent line-clamp-3'>
                {item.title}
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedPosts;
