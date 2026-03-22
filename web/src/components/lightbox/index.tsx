'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Portal from '~/components/portal';

type Props = {
  name: string;
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

function Lightbox({ name, images, initialIndex, onClose }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;width:100%;`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <Portal>
      <div
        className='fixed inset-0 bg-black/95 z-50 flex flex-col'
        role='dialog'
        aria-modal='true'
        onClick={onClose}
      >
        <div className='flex justify-end p-4 shrink-0'>
          <button
            onClick={onClose}
            className='text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer p-2'
            aria-label='Close'
          >
            <X className='size-6' />
          </button>
        </div>

        <div className='flex-1 min-h-0' onClick={(e) => e.stopPropagation()}>
          <Swiper
            modules={[Navigation, Thumbs, Keyboard]}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
            }}
            keyboard={{ enabled: true }}
            navigation={{
              nextEl: '.lb-next',
              prevEl: '.lb-prev'
            }}
            initialSlide={initialIndex}
            loop={images.length > 1}
            className='h-full'
          >
            {images.map((src, i) => (
              <SwiperSlide
                key={i}
                className='flex items-center justify-center px-3'
              >
                <div className='relative size-full flex justify-center items-center'>
                  <Image
                    src={src}
                    alt={`${name} ${i + 1}`}
                    fill
                    className='object-contain'
                    priority={i === initialIndex}
                  />
                </div>
              </SwiperSlide>
            ))}

            {images.length > 1 && (
              <>
                <button className='lb-prev hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer p-3'>
                  <ChevronLeft className='size-5' />
                </button>
                <button className='lb-next hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer p-3'>
                  <ChevronRight className='size-5' />
                </button>
              </>
            )}
          </Swiper>
        </div>

        {images.length > 1 && (
          <div
            className='shrink-0 flex justify-center items-center p-3'
            onClick={(e) => e.stopPropagation()}
          >
            <Swiper
              modules={[FreeMode, Thumbs]}
              onSwiper={setThumbsSwiper}
              spaceBetween={8}
              slidesPerView='auto'
              freeMode
              watchSlidesProgress
              centeredSlides
              centeredSlidesBounds
              className='h-full'
            >
              {images.map((src, i) => (
                <SwiperSlide
                  key={i}
                  className='size-14! rounded-md [&.swiper-slide-thumb-active]:opacity-100 opacity-50 transition-opacity duration-200 cursor-pointer overflow-hidden'
                >
                  <div className='relative size-full'>
                    <Image
                      src={src}
                      alt={`${name} thumbnail ${i + 1}`}
                      fill
                      sizes='56px'
                      className='object-cover'
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </Portal>
  );
}

export default Lightbox;
