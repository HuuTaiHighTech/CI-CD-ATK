import Image from 'next/image';
import { Slider } from '~/components/sections/top-products/components';
import { Dictionary } from '~/lib/dictionary';
import { ProductTop } from '~/types';

type Props = {
  products: ProductTop[];
  dictionary: Dictionary;
};

function TopProducts({ products, dictionary }: Props) {
  return (
    <section className='relative bg-background py-10 md:py-16 overflow-hidden'>
      <div className='absolute top-0 right-0 size-0 md:size-100 bg-accent rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <Image
        src='/logo_deco.png'
        width={584}
        height={480}
        alt='Logo deco'
        loading='lazy'
        className='absolute top-0 right-0 hidden md:block opacity-25 pointer-events-none select-none translate-x-1/2'
      />
      <div className='container'>
        <div className='mb-5 md:mb-10'>
          <h3 className='text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center lg:mb-6 md:mb-3 mb-1'>
            {dictionary.top_products.title}
          </h3>
          <p className='text-white text-sm md:text-base lg:text-lg font-medium text-center'>
            {dictionary.top_products.subtitle}
          </p>
        </div>
        <div className='space-y-5'>
          <Slider products={products} cta={dictionary.detail} />
        </div>
      </div>
    </section>
  );
}

export default TopProducts;
