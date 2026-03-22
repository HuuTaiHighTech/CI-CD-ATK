'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { bannerService } from '~/services';

function HeroSection() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    bannerService.get('home').then(setImages);
  }, []);

  return (
    <div className='relative z-0'>
      {images.length > 0 ? (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          pagination={{ clickable: false }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          allowTouchMove={false}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className='relative w-full aspect-13/5 md:aspect-8/3'>
                <Image
                  src={img}
                  alt='banner'
                  fill
                  sizes='100vw'
                  className='object-cover'
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className='relative w-full aspect-13/5 md:aspect-8/3' />
      )}
      <div className='absolute w-full md:top-1/4 sm:top-1/5 top-[10%] z-1'>
        <div className='container'>
          <Image
            src='/text_atk.png'
            alt='text An Thai Khang'
            width={1251}
            height={166}
            className='block w-full h-auto object-contain'
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
