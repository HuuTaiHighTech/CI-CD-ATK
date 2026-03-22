'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '~/components/cards';
import type { ProductSummary } from '~/types';

type Props = {
  products: ProductSummary[];
};

function ProductsCarousel({ products }: Props) {
  return (
    <div className='relative'>
      <button
        type='button'
        className='swiper-btn-prev size-10 inline-flex justify-center items-center absolute top-1/2 left-2 bg-white text-primary rounded-full -translate-y-1/2 cursor-pointer disabled:opacity-50 disabled:cursor-default z-5'
      >
        <ChevronLeft className='size-5 shrink-0' strokeWidth={2.5} />
      </button>
      <button
        type='button'
        className='swiper-btn-next size-10 inline-flex justify-center items-center absolute top-1/2 right-2 bg-white text-primary rounded-full -translate-y-1/2 cursor-pointer disabled:opacity-50 disabled:cursor-default z-5'
      >
        <ChevronRight className='size-5 shrink-0' strokeWidth={2.5} />
      </button>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={2}
        navigation={{
          prevEl: '.swiper-btn-prev',
          nextEl: '.swiper-btn-next'
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }}
        className='p-1!'
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Product
              image={product?.images?.[0]}
              name={product.name}
              slug={product.slug}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductsCarousel;
