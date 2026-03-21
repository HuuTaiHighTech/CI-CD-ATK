'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import { Link } from '~/components/ui';
import type { ProductTop } from '~/types';
import { cn } from '~/lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

type Props = {
  cta: string;
  products: ProductTop[];
};

function Slider({ cta, products }: Props) {
  if (products.length < 1) return null;
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      className={cn(
        'relative pb-10! lg:pb-15!',
        '[&_.swiper-pagination]:absolute',
        '[&_.swiper-pagination]:bottom-0!',
        '[&_.swiper-pagination]:flex',
        '[&_.swiper-pagination]:justify-center',
        '[&_.swiper-pagination]:items-center',
        '[&_.swiper-pagination-bullet]:size-4!',
        '[&_.swiper-pagination-bullet]:lg:size-5!',
        '[&_.swiper-pagination-bullet]:bg-transparent!',
        '[&_.swiper-pagination-bullet]:border',
        '[&_.swiper-pagination-bullet]:lg:border-2',
        '[&_.swiper-pagination-bullet]:border-[#CCCCCC]!',
        '[&_.swiper-pagination-bullet-active]:border-none',
        '[&_.swiper-pagination-bullet-active]:bg-secondary!'
      )}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <Link
            href={`/products/${product.slug}`}
            className='relative w-full aspect-video bg-cover bg-center flex flex-col justify-end rounded-2xl overflow-hidden p-5 md:p-10'
            style={{
              backgroundImage: `url(${product.thumbnail})`
            }}
          >
            <div className='absolute top-0 left-0 size-full bg-[linear-gradient(180deg,rgba(51,51,51,0.02)_40%,rgba(31,31,31,0.6)_100%)]' />
            <div className='lg:w-1/2 md:w-3/5 lg:space-y-4 md:space-y-3 space-y-1 z-1'>
              <h3 className='lg:text-3xl md:text-2xl xs:text-xl text-base font-bold text-white'>
                {product.name}
              </h3>
              <p className='md:text-sm text-xs font-medium text-neutral-300 line-clamp-1 md:line-clamp-none'>
                {product.summary}
              </p>
              <span className='inline-flex lg:text-base md:text-sm text-xs font-medium justify-center items-center text-white gap-1'>
                {cta}
                <ChevronRight className='size-3' strokeWidth={3} />
              </span>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Slider;
