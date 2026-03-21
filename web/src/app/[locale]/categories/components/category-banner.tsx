'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { bannerService } from '~/services';

function CategoryBanner() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [banner, setBanner] = useState<string>();

  useEffect(() => {
    const init = async () => {
      if (!tab) return;
      const images = await bannerService.get(`categories-${tab}`);
      setBanner(images?.[0]);
    };

    init();
  }, [tab]);

  return (
    <div className='relative w-full aspect-4/1'>
      {banner && (
        <Image
          src={banner}
          alt={tab ?? ''}
          fill
          sizes='100vw'
          className='object-cover'
        />
      )}
    </div>
  );
}

export default CategoryBanner;
