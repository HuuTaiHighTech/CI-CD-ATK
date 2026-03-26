'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '~/lib/utils';
import Lightbox from '~/components/lightbox';

type Props = {
  name: string;
  images: string[];
};

function ProductGallery({ name, images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images?.length) return null;

  return (
    <>
      <div className='flex-1 h-fit grid grid-cols-12 gap-3'>
        <div className='col-span-4 space-y-3'>
          {images.map((img, index) => (
            <button
              key={index}
              className={cn(
                'w-full aspect-square relative rounded-xl',
                activeIndex === index
                  ? 'ring-2 ring-blue-500'
                  : 'hover:ring-2 hover:ring-blue-500',
                'overflow-hidden transition-all'
              )}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={activeIndex === index}
            >
              <Image
                src={img}
                alt={`${name} ${index + 1}`}
                fill
                sizes='(max-width: 1023px) 25vw, 160px'
                className='object-cover'
              />
            </button>
          ))}
        </div>
        <div className='relative col-span-8 w-full aspect-2/3 flex justify-center rounded-xl overflow-hidden'>
          <Image
            src={images[activeIndex]}
            alt={name}
            fill
            sizes='(max-width: 1023px) 75vw, 520px'
            className='object-cover outline-none cursor-zoom-in'
            onClick={() => setLightboxOpen(true)}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true);
            }}
          />
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          name={name}
          images={images}
          initialIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

export default ProductGallery;
