'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  name: string;
  images: string[];
};

function ProductGallery({ name, images }: Props) {
  const [image, setImage] = useState<string | undefined>(images?.[0]);
  return (
    <div className='flex-1 h-fit grid grid-cols-12 gap-3'>
      <div className='col-span-3 h-full flex flex-col gap-3'>
        {Array.isArray(images) &&
          images.map((img, index) => (
            <div
              key={index}
              className='flex-1 relative hover:ring-2 hover:ring-blue-400 rounded-xl overflow-hidden'
              onClick={() => setImage(img)}
              // onMouseEnter={() => setImage(img)}
            >
              <Image
                src={img}
                alt={`${name} ${index + 1}`}
                fill
                sizes='(max-width: 1023px) 25vw, 160px'
                className='size-full object-cover shrink-0'
              />
            </div>
          ))}
      </div>
      <div className='relative col-span-9 w-full aspect-2/3 flex justify-center'>
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            sizes='(max-width: 1023px) 75vw, 520px'
            className='size-full rounded-xl object-cover shrink-0'
          />
        )}
      </div>
    </div>
  );
}

export default ProductGallery;
