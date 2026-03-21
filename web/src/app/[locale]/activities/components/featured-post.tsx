'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Link } from '~/components/ui';
import { postService } from '~/services';
import type { PostSummary } from '~/types';

function FeaturedPost() {
  const [post, setPost] = useState<PostSummary>();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? undefined;

  useEffect(() => {
    const init = async () => {
      const { items } = await postService.get({
        limit: 1,
        group: tab,
        hot: true
      });
      setPost(items?.[0]);
    };

    init();
  }, [tab]);

  return (
    <div className='relative'>
      {post ? (
        <Link
          href={`/posts/${post.slug}`}
          className='relative block aspect-3/2'
        >
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            sizes='(max-width: 1280px) 100vw, 1280px'
            className='object-cover rounded-xl'
          />
        </Link>
      ) : (
        <div className='w-full aspect-3/2' />
      )}
    </div>
  );
}

export default FeaturedPost;
